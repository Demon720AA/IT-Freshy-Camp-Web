import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { QrCode, History, Trophy, User as UserIcon, LogOut, ShieldCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Profile, Scan } from '@/types/database'

type ScanWithProfile = Scan & { profiles: Profile }

export const dynamic = 'force-dynamic'

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error: queryError } = await searchParams
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

  const typedScans = (scans as unknown as ScanWithProfile[]) || []

  return (
    <div className="min-h-screen relative text-[#1e293b]">
      <div 
        className="fixed inset-0 bg-[url('/PIC/Bg.png')] bg-cover bg-center bg-no-repeat -z-10" 
        style={{ backgroundAttachment: 'fixed' }} // Extra insurance for some browsers
      />
      {/* Toast Messages */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/20 flex items-center gap-3 border border-green-400/20">
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="font-bold text-sm">{success}</p>
          </div>
        </div>
      )}

      {queryError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/20 flex items-center gap-3 border border-red-400/20">
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="font-bold text-sm">{queryError}</p>
          </div>
        </div>
      )}

      <div className="pb-24 text-[#1e293b]">
        {/* Header */}
        <div className="px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl shadow-blue-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-inner">
                <UserIcon className="text-white h-7 w-7" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Hello,</p>
                <h2 className="text-white font-black text-2xl tracking-tight">{profile.full_name}</h2>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <button className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md text-white transition-all active:scale-90 hover:bg-white/20 border border-white/10">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="bg-[url('/PIC/Menu/TokenShow.png')] bg-cover bg-center p-8 flex items-center justify-between relative z-10">
          {/* <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/20 flex items-center justify-between shadow-2xl relative z-10"> */}
            <div>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                {isSenior ? 'Total Freshmen Scanned' : 'Your Token Balance'}
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-white text-5xl font-black tracking-tighter">
                  {profile.total_tokens}
                </p>
                <span className="text-white/60 text-xs font-bold">TOKENS</span>
              </div>
            </div>
            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/20 transform rotate-3">
              {isSenior ? (
                <QrCode className="text-[#3244bb] h-10 w-10" />
              ) : (
                <Image src="/PIC/IT_Token.png" alt="Token" width={60} height={60} className="object-contain" />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 -mt-10 relative z-20">
          <div className="grid grid-cols-2 gap-5">
            {isSenior ? (
              <div className="grid grid-cols-2 gap-5 col-span-2 w-full">
                <Link
                  href="/senior/qr"
                  className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col items-center gap-4 transition-all active:scale-95 border border-slate-50 group hover:border-blue-100"
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3244bb] group-hover:scale-110 transition-transform">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <span className="font-black text-[#1e293b] text-sm uppercase tracking-wider">My QR</span>
                </Link>
                <Link
                  href="/leaderboard?tab=seniors"
                  className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col items-center gap-4 transition-all active:scale-95 border border-slate-50 group hover:border-orange-100"
                >
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <span className="font-black text-[#1e293b] text-sm uppercase tracking-wider">Ranking</span>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/scan"
                  className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col items-center gap-4 transition-all active:scale-95 border border-slate-50 group hover:border-blue-100"
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3244bb] group-hover:scale-110 transition-transform">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <span className="font-black text-[#1e293b] text-sm uppercase tracking-wider">Scan QR</span>
                </Link>
                <Link
                  href="/leaderboard"
                  className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col items-center gap-4 transition-all active:scale-95 border border-slate-50 group hover:border-orange-100"
                >
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <span className="font-black text-[#1e293b] text-sm uppercase tracking-wider">Ranking</span>
                </Link>
              </>
            )}
          </div>

          {/* History Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5 px-2">
              <h3 className="text-lg font-black text-[#ffffff] flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <History className="h-4 w-4 text-[#3244bb]" />
                </div>
                {isSenior ? 'Recent Scans' : 'Recent Activity'}
              </h3>
              {isFreshman && (
                <Link href="/history" className="text-xs font-black text-[#3244bb] flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {typedScans.length > 0 ? (
                typedScans.map((scan) => (
                  <div key={scan.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="bg-[url('/PIC/Menu/Profile.png')] bg-cover bg-center flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#64748b] border border-slate-100">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1e293b]">
                          {isSenior ? scan.profiles.full_name : `Scanned ${scan.profiles.full_name}`}
                        </p>
                        <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mt-0.5">
                          {isSenior ? `ID: ${scan.profiles.student_id} • ` : ''}
                          {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 text-[#3244bb] px-4 py-1.5 rounded-full text-[10px] font-black border border-blue-100 uppercase tracking-tighter">
                      {isSenior ? 'Verified' : '+1 Token'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                     <History className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-[#64748b] text-sm font-bold max-w-[200px]">
                    {isSenior ? 'No one has scanned your QR yet.' : 'No tokens collected yet. Start scanning!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-2xl rounded-full border border-white/50 px-8 py-3 flex justify-around items-center shadow-2xl shadow-blue-900/20 z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#3244bb] transition-all">
          <div className="bg-blue-500 p-3 rounded-full shadow-lg shadow-blue-500/30">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
        </Link>
        {isFreshman && (
          <>
            <Link href="/scan" className="flex flex-col items-center gap-1 text-[#94a3b8] hover:text-[#3244bb] transition-all">
              <QrCode className="h-6 w-6" />
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-[#94a3b8] hover:text-[#3244bb] transition-all">
              <Trophy className="h-6 w-6" />
            </Link>
          </>
        )}
        {isSenior && (
          <Link href="/senior/qr" className="flex flex-col items-center gap-1 text-[#94a3b8] hover:text-[#3244bb] transition-all">
            <QrCode className="h-6 w-6" />
          </Link>
        )}
      </div>
    </div>
  )
}
