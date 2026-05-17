'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function forgotPassword(formData: FormData) {
  const studentId = (formData.get('student_id') as string)?.trim()
  if (!studentId) {
    return redirect('/forgot-password?error=Student ID is required')
  }

  const email = `${studentId}@tni.ac.th`
  const supabaseAdmin = createAdminClient()
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || ''
  const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const origin = `${proto}://${host}`

  // 1. Generate the reset link using Supabase Admin
  const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: {
      redirectTo: `${origin}/auth/callback?next=/update-password`,
    }
  })

  if (linkError) {
    console.error('Link generation error:', linkError)
    // Fallback to standard Supabase flow
    const supabase = await createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/update-password`,
    })
    
    if (resetError) {
      return redirect(`/forgot-password?error=${encodeURIComponent(resetError.message)}`)
    }
    return redirect('/forgot-password?success=Check your email for the reset link (sent via Supabase)')
  }

  // 2. Send the custom email via Resend
  const { error: mailError } = await resend.emails.send({
    from: 'TNI Freshy Camp <onboarding@resend.dev>', // You should use your verified domain here
    to: [email],
    subject: 'Reset Your Password - TNI Freshy Camp',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #1e293b; text-align: center;">Reset Your Password</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Hello! You requested a password reset for your TNI Freshy Camp account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.properties.action_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          If you didn't request this, you can safely ignore this email. This link will expire shortly.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; 2026 TNI Freshy Camp. All rights reserved.
        </p>
      </div>
    `,
  })

  if (mailError) {
    console.error('Resend error:', mailError)
    return redirect(`/forgot-password?error=Failed to send email via Resend: ${mailError.message}`)
  }

  return redirect('/forgot-password?success=Check your email for the reset link (sent via Resend)')
}
