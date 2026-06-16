import { login } from './actions'
import { Lock, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SubmitButton } from '@/components/SubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 text-[#1e293b]">
      <div className="fixed inset-0 bg-[url('/PIC/Login/Bg.png')] bg-cover bg-center bg-no-repeat -z-10" />
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-12 text-center flex flex-col items-center">
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
          {/* <div className="inline-block bg-blue-100 px-6 py-1.5 rounded-full">
            <p className="text-[#2563eb] font-black text-xs uppercase tracking-[0.25em]">Token Collection System</p>
          </div> */}
        </div>

        <form 
          action={login}
          className="space-y-5 rounded-[3rem] bg-[url('/PIC/Login/BackgroundText.png')] bg-cover bg-center p-10 shadow-2xl shadow-blue-900/5"
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

          <div>
            <label className="mb-2 block text-sm font-bold text-[#1e293b] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-[#1e293b] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="mt-2 flex justify-end">
              <Link 
                href="/forgot-password"
                className="text-xs font-bold text-[#3244bb] hover:text-[#1d4ed8] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <div className="pt-2">
            <SubmitButton label="Login" loadingLabel="Logging in..." />
          </div>
        </form>

        {/* <p className="mt-8 text-center text-sm text-[#64748b] font-medium">
          Thai-Nichi Institute of Technology
        </p> */}
      </div>
    </div>
  )
}
