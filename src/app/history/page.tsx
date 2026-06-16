import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { History, ArrowLeft, User as UserIcon, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Profile, Scan } from '@/types/database'

type ScanWithProfile = Scan & { profiles: Profile }

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

  const typedScans = (scans as unknown as ScanWithProfile[]) || []

  return (
    <div className="min-h-screen bg-[url('/PIC/Menu/Menu.png')] bg-cover bg-center bg-fixed pb-24 text-[#1e293b]">
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
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Scan History</h1>
          <p className="text-white/70 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">
            All your collected tokens
          </p>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100 min-h-[60vh]">
          <div className="p-8">
            {typedScans.length > 0 ? (
              <div className="space-y-5">
                {typedScans.map((scan) => (
                  <div key={scan.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:border-blue-100 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563eb] border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
                        <UserIcon className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="font-black text-[#1e293b] tracking-tight">Scanned {scan.profiles.full_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-[#94a3b8]" />
                          <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                            {new Date(scan.created_at).toLocaleDateString()} • {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500 text-white px-5 py-2 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 border border-blue-400">
                      +1
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 flex flex-col items-center">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                   <History className="h-12 w-12 text-[#94a3b8]" />
                </div>
                <p className="text-[#94a3b8] font-black uppercase tracking-widest text-xs">No scan history yet.</p>
                <Link 
                  href="/scan" 
                  className="mt-10 px-12 py-5 bg-[#2563eb] text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/30 active:scale-95 transition-all uppercase text-xs tracking-[0.2em]"
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

