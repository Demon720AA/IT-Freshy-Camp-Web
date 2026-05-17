'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function forgotPassword(formData: FormData) {
  const studentId = (formData.get('student_id') as string)?.trim()
  if (!studentId) {
    return redirect('/forgot-password?error=Student ID is required')
  }

  const email = `${studentId}@tni.ac.th`
  const supabase = await createClient()
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || ''
  const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const origin = `${proto}://${host}`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  return redirect('/forgot-password?success=Check your email for the reset link')
}
