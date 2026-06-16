import { sendResetOtp, verifyResetOtp } from './actions'
import { ArrowLeft, User, Hash } from 'lucide-react'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import Image from 'next/image'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; email?: string }>
}) {
  const { error, success, email } = await searchParams

  return (
    <div className="mx-auto max-w-md min-h-screen relative overflow-x-hidden bg-[url('/PIC/Login/Bg.png')] bg-cover bg-center bg-fixedshadow-[0_0_100px_rgba(0,0,0,0.1)]">
    {/* \</div><div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-[#1e293b]"> */}
      <div className="w-full max-w-md animate-fade-in">
        <Link 
          href="/login"
          className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#64748b] active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="mb-8 text-center flex flex-col items-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150" />
            <Image 
              src="/PIC/Freshy Camp LOGO.png" 
              alt="Freshy Camp Logo" 
              width={360} 
              height={360} 
              className="relative z-10 drop-shadow-2xl"
              priority 
            />
          </div>
          <h1 className="text-3xl font-black text-[#f7f8f8]">Reset Password</h1>
          <p className="mt-2 text-[#2563eb] font-medium text-sm">
            {success ? 'Enter the 6-digit code sent to your email' : 'Enter your Student ID to receive a reset code'}
          </p>
        </div>

        {!success ? (
          <form 
            action={sendResetOtp}
            className="space-y-4 rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/5 border border-slate-100"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1e293b] ml-1">Student ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                <input
                  id="student_id"
                  name="student_id"
                  type="text"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-[#1e293b] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                  placeholder="e.g. 66123456"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <div className="pt-2">
              <SubmitButton label="Send Reset Code" loadingLabel="Sending..." />
            </div>
          </form>
        ) : (
          <form 
            action={verifyResetOtp}
            className="space-y-4 rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/5 border border-slate-100"
          >
            <input type="hidden" name="email" value={email} />
            <div>
              <label className="mb-2 block text-sm font-bold text-[#1e293b] ml-1">6-Digit OTP Code</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-[#1e293b] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all tracking-[0.5em] text-center font-bold text-xl"
                  placeholder="000000"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <div className="pt-2">
              <SubmitButton label="Verify & Reset" loadingLabel="Verifying..." />
            </div>
            
            <Link 
              href="/forgot-password"
              className="block w-full py-2 text-sm text-center text-[#64748b] font-medium hover:text-[#2563eb] transition-colors"
            >
              Didn&apos;t receive code? Try again
            </Link>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#64748b] font-medium px-4">
          Check your TNI student email for the {success ? '6-digit code' : 'reset code'}.
        </p>
      </div>
    </div>
  )
}
