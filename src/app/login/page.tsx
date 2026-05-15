import { login } from './actions'
import { GraduationCap, Lock, User } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2563EB] shadow-lg shadow-blue-200">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Freshy Camp</h1>
          <p className="mt-2 text-[#64748b]">Token Collection System</p>
        </div>

        <form className="space-y-4 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475569]">Student ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
              <input
                id="student_id"
                name="student_id"
                type="text"
                required
                className="w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-4 text-[#1e293b] focus:ring-2 focus:ring-[#2563EB]"
                placeholder="e.g. 66123456"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#475569]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-4 text-[#1e293b] focus:ring-2 focus:ring-[#2563EB]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            formAction={login}
            className="w-full rounded-2xl bg-[#2563EB] py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#94a3b8]">
          Thai-Nichi Institute of Technology
        </p>
      </div>
    </div>
  )
}
