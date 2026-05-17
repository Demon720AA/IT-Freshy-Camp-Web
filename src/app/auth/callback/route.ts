import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const headerList = await headers()
      const host = headerList.get('x-forwarded-host') || headerList.get('host') || origin.split('://')[1]
      const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
      const finalOrigin = `${proto}://${host}`
      
      return NextResponse.redirect(`${finalOrigin}${next}`)
    } else {
      console.error('Auth callback error:', error.message)
      const headerList = await headers()
      const host = headerList.get('x-forwarded-host') || headerList.get('host') || origin.split('://')[1]
      const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
      const finalOrigin = `${proto}://${host}`
      return NextResponse.redirect(`${finalOrigin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // If there is no code, redirect to login
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || origin.split('://')[1]
  const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const finalOrigin = `${proto}://${host}`
  return NextResponse.redirect(`${finalOrigin}/login?error=No authentication code provided`)
}
