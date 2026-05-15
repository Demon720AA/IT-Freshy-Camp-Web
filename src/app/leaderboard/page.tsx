import { createClient } from '@/utils/supabase/server'
import { Trophy, Medal, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: rankings } = await supabase
    .from('profiles')
    .select('full_name, total_tokens, student_id')
    .eq('role', 'FRESHMAN')
    .order('total_tokens', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-[#3244bb] pb-12 text-white">
      <div className="bg-[#3bc4d2] px-6 pt-12 pb-20 rounded-b-[3rem] shadow-xl shadow-black/20 relative">
        <Link 
          href="/"
          className="absolute left-6 top-12 h-10 w-10 bg-[#3244bb]/10 rounded-xl flex items-center justify-center backdrop-blur-md text-[#3244bb]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#3244bb]">Leaderboard</h1>
          <p className="text-[#3244bb]/80 text-sm font-bold mt-1">Top Freshmen Performers</p>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white/5 rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden border border-white/10 backdrop-blur-xl">
          <div className="p-6">
            {rankings && rankings.length > 0 ? (
              <div className="space-y-3">
                {rankings.map((rank: any, index: number) => {
                  const isTop3 = index < 3
                  const medals = [
                    'text-yellow-400 bg-yellow-400/10',
                    'text-slate-300 bg-slate-300/10',
                    'text-amber-500 bg-amber-500/10'
                  ]

                  return (
                    <div 
                      key={rank.student_id}
                      className={`flex items-center justify-between p-4 rounded-3xl transition-all border ${
                        index === 0 ? 'bg-[#3bc4d2]/10 border-[#3bc4d2]/20' : 'bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                          isTop3 ? medals[index] : 'text-slate-400 bg-white/5'
                        }`}>
                          {isTop3 ? <Medal className="h-6 w-6" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-white">{rank.full_name}</p>
                          <p className="text-xs text-slate-400">ID: {rank.student_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-black ${isTop3 ? 'text-[#3bc4d2]' : 'text-white'}`}>
                          {rank.total_tokens}
                        </span>
                        <Trophy className={`h-4 w-4 ${isTop3 ? 'text-[#3bc4d2]' : 'text-slate-500'}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 font-medium">No rankings available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
