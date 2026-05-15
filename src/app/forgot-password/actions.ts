'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function forgotPassword(formData: FormData) {
  const studentId = formData.get('student_id') as string
  const email = `${studentId}@tni.ac.th`
  
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return redirect('/forgot-password?error=Could not reset password')
  }

  return redirect('/forgot-password?success=Check your email for the reset link')
}
