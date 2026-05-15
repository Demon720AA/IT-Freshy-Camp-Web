'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const studentId = formData.get('student_id') as string
  const password = formData.get('password') as string

  // Assuming student_id is used as email. Adjust as needed.
  // If the seeded accounts use student_id@example.com, append it here.
  const email = `${studentId}@tni.ac.th` 

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=Could not authenticate user')
  }

  return redirect('/')
}
