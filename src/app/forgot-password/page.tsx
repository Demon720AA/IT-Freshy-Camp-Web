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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-[#1e293b]">
      <div className="w-full max-w-md animate-fade-in">
        <Link 
          href="/login"
          className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#64748b] active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2563eb] shadow-xl shadow-blue-500/20">
            <KeyRound className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#1e293b]">Reset Password</h1>
          <p className="mt-2 text-[#2563eb] font-medium text-sm">Enter your Student ID to receive a reset link</p>
        </div>

        <form className="space-y-4 rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-black/5 border border-slate-100">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#1e293b] ml-1">Student ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
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

          {success && (
            <div className="rounded-2xl bg-green-50 border border-green-100 p-4 text-center text-sm font-bold text-green-600 leading-relaxed">
              {success}
            </div>
          )}

          <div className="pt-2">
            <button
              formAction={forgotPassword}
              className="w-full rounded-2xl bg-[#2563eb] py-4 font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-[#64748b] font-medium">
          Check your TNI student email for the link.
        </p>
      </div>
    </div>
  )
}
