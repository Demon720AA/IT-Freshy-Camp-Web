'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function sendResetOtp(formData: FormData) {
  const studentId = (formData.get('student_id') as string)?.trim()
  if (!studentId) {
    return redirect('/forgot-password?error=Student ID is required')
  }

  const email = `${studentId}@tni.ac.th`
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    console.error('Password reset error:', error)
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`/forgot-password?success=OTP sent to your email&email=${encodeURIComponent(email)}`)
}

export async function verifyResetOtp(formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  if (!email || !token) {
    return redirect(`/forgot-password?error=Email and OTP are required&email=${encodeURIComponent(email || '')}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  })

  if (error) {
    console.error('OTP verification error:', error)
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}&email=${encodeURIComponent(email)}`)
  }

  return redirect('/update-password')
}
