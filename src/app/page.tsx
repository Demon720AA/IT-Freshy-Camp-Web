import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { QrCode, History, Trophy, User as UserIcon, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div>Profile not found. Please contact admin.</div>
  }

  // Fetch recent scans
  const { data: scans } = await supabase
    .from('scans')
    .select('*, profiles!senior_id(full_name)')
    .eq('freshman_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-[#2563EB] px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg shadow-blue-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <UserIcon className="text-white h-6 w-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Welcome back,</p>
              <h2 className="text-white font-bold text-xl">{profile.full_name}</h2>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md text-white transition-all active:scale-95">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Your Tokens</p>
            <p className="text-white text-4xl font-black mt-1">{profile.total_tokens}</p>
          </div>
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-inner">
            <Trophy className="text-[#2563EB] h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/scan"
            className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center gap-3 transition-all active:scale-95 border border-slate-50"
          >
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563EB]">
              <QrCode className="h-7 w-7" />
            </div>
            <span className="font-bold text-[#1e293b]">Scan QR</span>
          </Link>
          <Link
            href="/leaderboard"
            className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center gap-3 transition-all active:scale-95 border border-slate-50"
          >
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Trophy className="h-7 w-7" />
            </div>
            <span className="font-bold text-[#1e293b]">Ranking</span>
          </Link>
        </div>

        {/* History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
              <History className="h-5 w-5 text-[#2563EB]" />
              Recent Collection
            </h3>
            <Link href="/history" className="text-sm font-semibold text-[#2563EB]">View All</Link>
          </div>

          <div className="space-y-3">
            {scans && scans.length > 0 ? (
              scans.map((scan: any) => (
                <div key={scan.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#64748b]">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1e293b] text-sm">
                        Scanned {scan.profiles.full_name}
                      </p>
                      <p className="text-xs text-[#94a3b8]">
                        {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                    +1 Token
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-[#94a3b8] text-sm">No tokens collected yet. Start scanning!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#2563EB]">
          <div className="bg-blue-50 p-2 rounded-xl">
            <UserIcon className="h-6 w-6" />
          </div>
        </Link>
        <Link href="/scan" className="flex flex-col items-center gap-1 text-[#94a3b8]">
          <QrCode className="h-6 w-6" />
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-[#94a3b8]">
          <Trophy className="h-6 w-6" />
        </Link>
      </div>
    </div>
  )
}
