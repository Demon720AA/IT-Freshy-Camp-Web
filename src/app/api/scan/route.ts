import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { senior_id } = await request.json()
    const supabase = await createClient()

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

    // Increment token count for the freshman
    // Using an update instead of RPC for simplicity if trigger is not set up yet
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('total_tokens')
      .eq('id', user.id)
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ total_tokens: (profile.total_tokens || 0) + 1 })
      .eq('id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
