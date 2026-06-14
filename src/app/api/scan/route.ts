import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { senior_id: qrValue } = await request.json()
    const supabase = await createClient()

    // Parse senior_id:timestamp
    const parts = qrValue.split(':')
    const senior_id = parts[0]
    const timestamp = parts.length > 1 ? parseInt(parts[1]) : 0

    // Validate timestamp (allow 60 seconds of drift/validity)
    const now = Date.now()
    if (!timestamp || (now - timestamp) > 60000) {
      return NextResponse.json({ error: 'QR code expired. Please ask the senior to refresh.' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert into scans table. The unique constraint on (freshman_id, senior_id)
    // will prevent duplicate scans at the database level.
    const { error: scanError } = await supabase
      .from('scans')
      .insert({ 
        freshman_id: user.id, 
        senior_id: senior_id 
      })

    if (scanError) {
      if (scanError.code === '23505') { // Postgres unique_violation
        return NextResponse.json({ error: 'Already scanned this senior' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to record scan: ' + scanError.message }, { status: 500 })
    }

    // Safely increment tokens for both the freshman and the senior using RPC
    console.log(`Incrementing tokens for Freshman: ${user.id}`)
    const { error: freshmanRpcError } = await supabase.rpc('increment_tokens', { user_id: user.id })
    if (freshmanRpcError) {
      console.error('Freshman token update failed:', freshmanRpcError)
      throw freshmanRpcError
    }

    console.log(`Incrementing tokens for Senior: ${senior_id}`)
    const { error: seniorRpcError } = await supabase.rpc('increment_tokens', { user_id: senior_id })
    if (seniorRpcError) {
      console.error('Senior token update failed:', seniorRpcError)
      throw seniorRpcError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
