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
      // Assuming decodedText is the senior's profile ID
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
    <div className="flex flex-col items-center gap-6">
      {status === 'processing' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-[#2563EB]" />
          <p className="mt-4 font-bold text-[#1e293b]">Verifying Scan...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b]">Token Collected!</h2>
          <p className="text-[#64748b] mt-2">+1 Token added to your profile</p>
        </div>
      )}

      {status === 'error' && (
        <div className="w-full max-w-sm rounded-3xl bg-red-50 p-6 border border-red-100 flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-red-900">Scan Failed</h3>
          <p className="text-red-700 mt-1 mb-6">{errorMsg}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-2xl bg-white border border-red-200 text-red-700 font-bold"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-black shadow-2xl shadow-blue-200">
        <div id="reader" className="w-full"></div>
        <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 flex items-center justify-center">
           <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
           </div>
        </div>
      </div>

      <div className="text-center px-8">
        <h2 className="text-xl font-bold text-[#1e293b]">Scan QR Code</h2>
        <p className="text-[#64748b] mt-2 text-sm leading-relaxed">
          Position the senior's QR code within the frame to collect your token.
        </p>
      </div>

      <Link 
        href="/"
        className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-[#64748b]"
      >
        <X className="h-6 w-6" />
      </Link>
    </div>
  )
}
