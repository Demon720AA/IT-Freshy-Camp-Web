'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, X, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Scanner() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop()
    }
  }, [])

  const handleScan = useCallback(async (seniorId: string) => {
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
      console.error("Scan error:", err)
      setStatus('error')
      setErrorMsg('Failed to process scan')
    }
  }, [router])

  const onScanSuccess = useCallback((decodedText: string) => {
    stopScanner().then(() => handleScan(decodedText))
  }, [stopScanner, handleScan])

  const onScanFailure = useCallback(() => {
    // console.warn(`Code scan error = ${error}`);
  }, [])

  const startScanner = useCallback(async (mode: 'user' | 'environment') => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('reader', {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        })
      }

      await stopScanner()

      await scannerRef.current.start(
        { facingMode: mode },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        onScanSuccess,
        onScanFailure
      )
      setStatus('idle')
    } catch (err) {
      console.error("Failed to start scanner", err)
      setStatus('error')
      setErrorMsg("Camera access denied or not found")
    }
  }, [stopScanner, onScanSuccess, onScanFailure])

  useEffect(() => {
    let isMounted = true;
    
    const initScanner = async () => {
      if (isMounted) {
        await startScanner(facingMode)
      }
    }
    
    initScanner()

    return () => {
      isMounted = false;
      stopScanner().catch(err => console.error("Failed to stop scanner", err))
    }
  }, [facingMode, startScanner, stopScanner])

  const toggleCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newMode)
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc] px-8 text-center">
          <div className="relative mb-10 scale-125">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <Image 
              src="/Ref/✅.png" 
              alt="Success" 
              width={200} 
              height={200} 
              className="relative z-10 drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
            />
          </div>
          <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Verified!</h2>
          <div className="mt-4 bg-blue-100 px-6 py-2 rounded-full">
            <p className="text-[#2563eb] font-black text-xs uppercase tracking-[0.2em]">+1 Token Collected</p>
          </div>
          <p className="mt-8 text-[#64748b] font-bold text-sm">Returning to dashboard...</p>
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

          <div className="flex gap-4">
            <button
              onClick={toggleCamera}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#2563eb] active:scale-90 transition-all shadow-lg"
              title="Flip Camera"
            >
              <RefreshCw className="h-8 w-8" />
            </button>

            <Link 
              href="/"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#64748b] active:scale-90 transition-all shadow-lg"
            >
              <X className="h-8 w-8" />
            </Link>
          </div>
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
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  )
}
