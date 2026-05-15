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
    <div className="min-h-screen bg-[#f8fafc] pb-12 text-[#1e293b]">
      <div className="bg-[#2563eb] px-6 pt-12 pb-20 rounded-b-[3rem] shadow-xl shadow-blue-500/20 relative">
        <Link 
          href="/"
          className="absolute left-6 top-12 h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Scan History</h1>
          <p className="text-white/80 text-sm font-bold mt-1">All your collected tokens</p>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-slate-100 min-h-[60vh]">
          <div className="p-6">
            {scans && scans.length > 0 ? (
              <div className="space-y-4">
                {scans.map((scan: any) => (
                  <div key={scan.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] shadow-sm">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1e293b]">Scanned {scan.profiles.full_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-[#64748b]" />
                          <p className="text-xs text-[#64748b]">
                            {new Date(scan.created_at).toLocaleDateString()} at {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#2563eb]/10 text-[#2563eb] px-4 py-1.5 rounded-2xl text-xs font-black border border-[#2563eb]/10">
                      +1
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 flex flex-col items-center">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                   <History className="h-10 w-10 text-[#64748b]" />
                </div>
                <p className="text-[#64748b] font-bold">No scan history yet.</p>
                <Link 
                  href="/scan" 
                  className="mt-8 px-10 py-4 bg-[#2563eb] text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
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
