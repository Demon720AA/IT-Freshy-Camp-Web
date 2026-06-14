import { createClient } from '@/utils/supabase/server'
import { Trophy, Medal, ArrowLeft, Users, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { Profile } from '@/types/database'

export const revalidate = 15 // Revalidate every 15 seconds

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'freshmen' } = await searchParams
  const isSeniorsTab = tab === 'seniors'
  const targetRole = isSeniorsTab ? 'SENIOR' : 'FRESHMAN'

  const supabase = await createClient()

  const { data: rankings } = await supabase
    .from('profiles')
    .select('full_name, total_tokens, student_id')
    .eq('role', targetRole)
    .order('total_tokens', { ascending: false })
    .limit(20)

  const typedRankings = (rankings as unknown as Profile[]) || []

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-[#1e293b]">
      {/* Header */}
      <div className="bg-[#2563eb] px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl shadow-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <Link 
          href="/"
          className="absolute left-6 top-12 h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md text-white border border-white/10 active:scale-90 transition-all z-20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="text-center relative z-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Leaderboard</h1>
          <p className="text-white/70 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">
            {isSeniorsTab ? 'Most Scanned Seniors' : 'Top Freshmen Performers'}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-20">
        {/* Tab Switcher */}
        <div className="bg-white/10 backdrop-blur-2xl p-1.5 rounded-[2rem] flex mb-8 border border-white/20 shadow-2xl">
          <Link 
            href="/leaderboard?tab=freshmen"
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
              !isSeniorsTab ? 'bg-white text-[#2563eb] shadow-xl' : 'text-white/70 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            Freshmen
          </Link>
          <Link 
            href="/leaderboard?tab=seniors"
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
              isSeniorsTab ? 'bg-white text-[#2563eb] shadow-xl' : 'text-white/70 hover:text-white'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Seniors
          </Link>
        </div>

        {/* Ranking List */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100 min-h-[50vh]">
          <div className="p-8">
            {typedRankings.length > 0 ? (
              <div className="space-y-4">
                {typedRankings.map((rank, index) => {
                  const isTop3 = index < 3
                  const medals = [
                    'text-yellow-600 bg-yellow-50 border-yellow-100',
                    'text-slate-500 bg-slate-50 border-slate-100',
                    'text-amber-700 bg-amber-50 border-amber-100'
                  ]

                  return (
                    <div 
                      key={rank.student_id}
                      className={`flex items-center justify-between p-5 rounded-[2rem] transition-all border ${
                        index === 0 ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-white border-transparent hover:border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center font-black text-xl shadow-inner ${
                          isTop3 ? medals[index] : 'text-[#64748b] bg-slate-50 border-slate-100'
                        }`}>
                          {isTop3 ? <Medal className="h-7 w-7" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-black text-[#1e293b] tracking-tight">{rank.full_name}</p>
                          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mt-0.5">ID: {rank.student_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-1.5">
                              <span className={`text-2xl font-black tracking-tighter ${isTop3 ? 'text-[#2563eb]' : 'text-[#1e293b]'}`}>
                                {rank.total_tokens}
                              </span>
                              <Trophy className={`h-4 w-4 ${isTop3 ? 'text-[#2563eb]' : 'text-[#64748b]'}`} />
                           </div>
                           <p className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.1em]">
                              {isSeniorsTab ? 'Scans' : 'Tokens'}
                           </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-32 flex flex-col items-center">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                   <Users className="h-10 w-10 text-slate-200" />
                </div>
                <p className="text-[#64748b] font-black uppercase tracking-widest text-xs">No rankings available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

