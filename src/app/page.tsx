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

  const isSenior = profile.role === 'SENIOR'
  const isFreshman = profile.role === 'FRESHMAN'

  // Fetch data based on role
  let scans = []
  if (isFreshman) {
    const { data } = await supabase
      .from('scans')
      .select('*, profiles!senior_id(full_name)')
      .eq('freshman_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    scans = data || []
  } else if (isSenior) {
    const { data } = await supabase
      .from('scans')
      .select('*, profiles!freshman_id(full_name, student_id)')
      .eq('senior_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    scans = data || []
  }

  return (
    <div className="min-h-screen bg-[#3244bb] pb-24 text-white">
      {/* Header */}
      <div className="bg-[#3bc4d2] px-6 pt-12 pb-24 rounded-b-[3rem] shadow-xl shadow-black/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <UserIcon className="text-white h-6 w-6" />
            </div>
            <div>
              <p className="text-[#3244bb]/80 text-sm font-medium">Welcome back,</p>
              <h2 className="text-[#3244bb] font-black text-xl">{profile.full_name}</h2>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="h-12 w-12 rounded-2xl bg-[#3244bb]/10 flex items-center justify-center backdrop-blur-md text-[#3244bb] transition-all active:scale-95">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="bg-[#3244bb]/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 flex items-center justify-between">
          <div>
            <p className="text-[#3244bb]/80 text-sm font-bold uppercase tracking-wider">
              {isSenior ? 'Freshmen Scanned' : 'Your Tokens'}
            </p>
            <p className="text-[#3244bb] text-4xl font-black mt-1">
              {isSenior ? (scans.length >= 5 ? '5+' : scans.length) : profile.total_tokens}
            </p>
          </div>
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
            {isSenior ? (
              <QrCode className="text-[#3244bb] h-8 w-8" />
            ) : (
              <Trophy className="text-[#3244bb] h-8 w-8" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12">
        <div className="grid grid-cols-2 gap-4">
          {isSenior ? (
            <Link
              href="/senior/qr"
              className="bg-[#3bc4d2] p-6 rounded-3xl shadow-xl shadow-black/20 flex flex-col items-center gap-3 transition-all active:scale-95 border border-white/10 col-span-2"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#3244bb] flex items-center justify-center text-[#3bc4d2]">
                <QrCode className="h-7 w-7" />
              </div>
              <span className="font-bold text-[#3244bb]">My QR Code</span>
            </Link>
          ) : (
            <>
              <Link
                href="/scan"
                className="bg-white/10 p-6 rounded-3xl shadow-xl shadow-black/20 flex flex-col items-center gap-3 transition-all active:scale-95 border border-white/10 backdrop-blur-md"
              >
                <div className="h-14 w-14 rounded-2xl bg-[#3bc4d2]/20 flex items-center justify-center text-[#3bc4d2]">
                  <QrCode className="h-7 w-7" />
                </div>
                <span className="font-bold text-white">Scan QR</span>
              </Link>
              <Link
                href="/leaderboard"
                className="bg-white/10 p-6 rounded-3xl shadow-xl shadow-black/20 flex flex-col items-center gap-3 transition-all active:scale-95 border border-white/10 backdrop-blur-md"
              >
                <div className="h-14 w-14 rounded-2xl bg-orange-400/20 flex items-center justify-center text-orange-400">
                  <Trophy className="h-7 w-7" />
                </div>
                <span className="font-bold text-white">Ranking</span>
              </Link>
            </>
          )}
        </div>

        {/* History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-[#3bc4d2]" />
              {isSenior ? 'Recent Scans' : 'Recent Collection'}
            </h3>
            {isFreshman && <Link href="/history" className="text-sm font-semibold text-[#3bc4d2]">View All</Link>}
          </div>

          <div className="space-y-3">
            {scans && scans.length > 0 ? (
              scans.map((scan: any) => (
                <div key={scan.id} className="bg-white/5 p-4 rounded-2xl shadow-sm border border-white/5 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-300">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        {isSenior ? scan.profiles.full_name : `Scanned ${scan.profiles.full_name}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {isSenior ? `ID: ${scan.profiles.student_id} • ` : ''}
                        {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#3bc4d2]/20 text-[#3bc4d2] px-3 py-1 rounded-full text-xs font-bold border border-[#3bc4d2]/20">
                    {isSenior ? 'Verified' : '+1 Token'}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/5 p-8 rounded-3xl border-2 border-dashed border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                  {isSenior ? 'No one has scanned your QR yet.' : 'No tokens collected yet. Start scanning!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#3244bb]/80 backdrop-blur-xl border-t border-white/10 px-8 py-4 flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#3bc4d2]">
          <div className="bg-[#3bc4d2]/20 p-2 rounded-xl">
            <UserIcon className="h-6 w-6" />
          </div>
        </Link>
        {isFreshman && (
          <>
            <Link href="/scan" className="flex flex-col items-center gap-1 text-slate-400">
              <QrCode className="h-6 w-6" />
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-slate-400">
              <Trophy className="h-6 w-6" />
            </Link>
          </>
        )}
        {isSenior && (
          <Link href="/senior/qr" className="flex flex-col items-center gap-1 text-slate-400">
            <QrCode className="h-6 w-6" />
          </Link>
        )}
      </div>
    </div>
  )
}
