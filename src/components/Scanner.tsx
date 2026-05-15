'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import Link from 'next/link'

export default function Scanner() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false
    )

    scanner.render(onScanSuccess, onScanFailure)

    function onScanSuccess(decodedText: string) {
      setScanResult(decodedText)
      scanner.clear()
      handleScan(decodedText)
    }

    function onScanFailure(error: any) {
      // console.warn(`Code scan error = ${error}`);
    }

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err))
    }
  }, [])

  const handleScan = async (seniorId: string) => {
    setStatus('processing')
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senior_id: seniorId }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 2000)
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('Failed to process scan')
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-fade-in">
      {status === 'processing' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc]/90 backdrop-blur-md">
          <Loader2 className="h-16 w-16 animate-spin text-[#2563eb]" />
          <p className="mt-6 font-black text-xl text-[#1e293b] tracking-widest uppercase">Verifying Scan</p>
        </div>
      )}

      {status === 'success' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc]">
          <div className="h-32 w-32 rounded-full bg-[#2563eb]/10 flex items-center justify-center mb-6 border border-[#2563eb]/20 shadow-2xl shadow-[#2563eb]/10">
            <CheckCircle2 className="h-20 w-20 text-[#2563eb]" />
          </div>
          <h2 className="text-3xl font-black text-[#1e293b]">Success!</h2>
          <p className="text-[#2563eb] mt-2 font-bold">+1 Token Collected</p>
        </div>
      )}

      {status === 'error' && (
        <div className="w-full rounded-[2.5rem] bg-red-50 p-8 border border-red-100 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-black text-red-600">Scan Failed</h3>
          <p className="text-red-700/80 mt-2 mb-8 font-medium leading-relaxed">{errorMsg}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-[#1e293b] font-black active:scale-95 transition-all shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'idle' && (
        <>
          <div className="relative w-full aspect-square overflow-hidden rounded-[3rem] bg-black shadow-2xl shadow-black/40 border-4 border-white/10">
            <div id="reader" className="w-full h-full scale-110"></div>
            <div className="absolute inset-0 pointer-events-none border-[30px] border-black/40 flex items-center justify-center">
               <div className="w-full h-full border-2 border-[#2563eb]/50 rounded-[2rem] relative">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#2563eb] rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#2563eb] rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#2563eb] rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#2563eb] rounded-br-2xl"></div>
                  
                  {/* Scan Line Animation */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2563eb] to-transparent animate-scan-line opacity-50"></div>
               </div>
            </div>
          </div>

          <div className="text-center px-4">
            <h2 className="text-2xl font-black text-[#1e293b]">Scanner</h2>
            <p className="text-[#64748b] mt-2 font-medium leading-relaxed">
              Align the QR code within the frame to automatically collect your token.
            </p>
          </div>

          <Link 
            href="/"
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#64748b] active:scale-90 transition-all shadow-lg"
          >
            <X className="h-8 w-8" />
          </Link>
        </>
      )}

      <style jsx global>{`
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
        .animate-scan-line {
          animation: scan 2s linear infinite;
        }
        #reader__dashboard_section_csr button {
          background-color: #2563eb !important;
          color: white !important;
          border-radius: 1rem !important;
          padding: 0.75rem 1.5rem !important;
          font-weight: 800 !important;
          border: none !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        #reader__status_span {
          color: #2563eb !important;
          font-weight: 700 !important;
        }
      `}</style>
    </div>
  )
}
