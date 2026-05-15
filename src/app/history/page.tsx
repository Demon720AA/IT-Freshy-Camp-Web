import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { History, ArrowLeft, User as UserIcon, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: scans } = await supabase
    .from('scans')
    .select('*, profiles!senior_id(full_name)')
    .eq('freshman_id', user.id)
    .order('created_at', { ascending: false })

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
          <h1 className="text-2xl font-black text-[#3244bb]">Scan History</h1>
          <p className="text-[#3244bb]/80 text-sm font-bold mt-1">All your collected tokens</p>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white/5 rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden border border-white/10 backdrop-blur-xl min-h-[60vh]">
          <div className="p-6">
            {scans && scans.length > 0 ? (
              <div className="space-y-4">
                {scans.map((scan: any) => (
                  <div key={scan.id} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#3bc4d2] shadow-sm">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Scanned {scan.profiles.full_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <p className="text-xs text-slate-400">
                            {new Date(scan.created_at).toLocaleDateString()} at {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#3bc4d2]/20 text-[#3bc4d2] px-4 py-1.5 rounded-2xl text-xs font-black border border-[#3bc4d2]/20">
                      +1
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 flex flex-col items-center">
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                   <History className="h-10 w-10 text-slate-500" />
                </div>
                <p className="text-slate-400 font-bold">No scan history yet.</p>
                <Link 
                  href="/scan" 
                  className="mt-8 px-10 py-4 bg-[#3bc4d2] text-[#3244bb] rounded-2xl font-black shadow-lg shadow-[#3bc4d2]/20 active:scale-95 transition-all"
                >
                  Start Scanning
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
