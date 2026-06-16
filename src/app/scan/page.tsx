'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const Scanner = dynamic(() => import('@/components/Scanner'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-md min-h-screen relative overflow-x-hidden bg-[url('/PIC/Qr scanner/QRscanner.png')] bg-cover bg-center bg-fixedshadow-[0_0_100px_rgba(0,0,0,0.1)]">
    {/* <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"> */}
      <Loader2 className="h-12 w-12 animate-spin text-[#2563eb]" />
      <p className="font-bold text-[#64748b]">Initializing Camera...</p>
    </div>
  ),
})

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-[url('/PIC/Qr scanner/QRscanner.png')] bg-cover bg-center bg-fixed px-6 py-12 flex flex-col items-center">
      <Scanner />
    </div>
  )
}

