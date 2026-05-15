import { forgotPassword } from './actions'
import { KeyRound, ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#3244bb] px-6 text-white">
      <div className="w-full max-w-md animate-fade-in">
        <Link 
          href="/login"
          className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 active:scale-90 transition-all"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#3bc4d2] shadow-xl shadow-black/20">
            <KeyRound className="h-10 w-10 text-[#3244bb]" />
          </div>
          <h1 className="text-3xl font-black text-white">Reset Password</h1>
          <p className="mt-2 text-[#3bc4d2] font-medium text-sm">Enter your Student ID to receive a reset link</p>
        </div>

        <form className="space-y-4 rounded-[2.5rem] bg-white/5 p-8 shadow-2xl shadow-black/20 border border-white/10 backdrop-blur-xl">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300 ml-1">Student ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="student_id"
                name="student_id"
                type="text"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3bc4d2] transition-all"
                placeholder="e.g. 66123456"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm font-bold text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-center text-sm font-bold text-green-400 leading-relaxed">
              {success}
            </div>
          )}

          <div className="pt-2">
            <button
              formAction={forgotPassword}
              className="w-full rounded-2xl bg-[#3bc4d2] py-4 font-black text-[#3244bb] shadow-lg shadow-[#3bc4d2]/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Check your TNI student email for the link.
        </p>
      </div>
    </div>
  )
}
