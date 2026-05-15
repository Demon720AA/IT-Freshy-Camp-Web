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
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="bg-[#2563EB] px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg shadow-blue-100 relative">
        <Link 
          href="/"
          className="absolute left-6 top-12 h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Leaderboard</h1>
          <p className="text-blue-100 text-sm mt-1">Top Freshmen Performers</p>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-50">
          <div className="p-6">
            {rankings && rankings.length > 0 ? (
              <div className="space-y-4">
                {rankings.map((rank: any, index: number) => {
                  const isTop3 = index < 3
                  const medals = [
                    'text-yellow-500 bg-yellow-50',
                    'text-slate-400 bg-slate-50',
                    'text-amber-600 bg-amber-50'
                  ]

                  return (
                    <div 
                      key={rank.student_id}
                      className={`flex items-center justify-between p-4 rounded-3xl transition-all ${
                        index === 0 ? 'bg-blue-50/50 border border-blue-100' : 'bg-slate-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                          isTop3 ? medals[index] : 'text-[#64748b] bg-white'
                        }`}>
                          {isTop3 ? <Medal className="h-6 w-6" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-[#1e293b]">{rank.full_name}</p>
                          <p className="text-xs text-[#94a3b8]">ID: {rank.student_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#2563EB]">{rank.total_tokens}</span>
                        <Trophy className="h-4 w-4 text-orange-400" />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#94a3b8]">No rankings available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
