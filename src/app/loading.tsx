import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[url('/PIC/Bg.png')] bg-cover bg-center bg-fixed flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-3xl bg-[#2563eb]/10 flex items-center justify-center animate-pulse">
           <Loader2 className="h-10 w-10 text-[#2563eb] animate-spin" />
        </div>
        <div className="absolute -inset-4 border-2 border-dashed border-[#2563eb]/20 rounded-[2.5rem] animate-[spin_10s_linear_infinite]"></div>
      </div>
      
      <div className="mt-8 space-y-3">
        <div className="h-8 w-48 bg-slate-200 rounded-full mx-auto animate-pulse"></div>
        <div className="h-4 w-32 bg-slate-100 rounded-full mx-auto animate-pulse"></div>
      </div>

      <div className="mt-12 w-full max-w-xs space-y-4">
        <div className="h-32 w-full bg-white rounded-[2rem] shadow-sm animate-pulse border border-slate-100"></div>
        <div className="h-32 w-full bg-white rounded-[2rem] shadow-sm animate-pulse border border-slate-100 opacity-60"></div>
      </div>
    </div>
  )
}
