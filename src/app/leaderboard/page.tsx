import { createClient } from '@/utils/supabase/server'
import { Trophy, Medal, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 15 // Revalidate every 15 seconds

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: rankings } = await supabase
    .from('profiles')
    .select('full_name, total_tokens, student_id')
    .eq('role', 'FRESHMAN')
    .order('total_tokens', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 text-[#1e293b]">
      <div className="bg-[#2563eb] px-6 pt-12 pb-20 rounded-b-[3rem] shadow-xl shadow-blue-500/20 relative">
        <Link 
          href="/"
          className="absolute left-6 top-12 h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Leaderboard</h1>
          <p className="text-white/80 text-sm font-bold mt-1">Top Freshmen Performers</p>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-slate-100">
          <div className="p-6">
            {rankings && rankings.length > 0 ? (
              <div className="space-y-3">
                {rankings.map((rank: any, index: number) => {
                  const isTop3 = index < 3
                  const medals = [
                    'text-yellow-500 bg-yellow-50',
                    'text-slate-500 bg-slate-50',
                    'text-amber-600 bg-amber-50'
                  ]

                  return (
                    <div 
                      key={rank.student_id}
                      className={`flex items-center justify-between p-4 rounded-3xl transition-all border ${
                        index === 0 ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                          isTop3 ? medals[index] : 'text-[#64748b] bg-slate-50'
                        }`}>
                          {isTop3 ? <Medal className="h-6 w-6" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-[#1e293b]">{rank.full_name}</p>
                          <p className="text-xs text-[#64748b]">ID: {rank.student_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-black ${isTop3 ? 'text-[#2563eb]' : 'text-[#1e293b]'}`}>
                          {rank.total_tokens}
                        </span>
                        <Trophy className={`h-4 w-4 ${isTop3 ? 'text-[#2563eb]' : 'text-[#64748b]'}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#64748b] font-medium">No rankings available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
