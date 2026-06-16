'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Download, Share2, ShieldCheck, RefreshCw, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'

interface SeniorQRProps {
  seniorId: string
  fullName: string
  studentId: string
}

export default function SeniorQR({ seniorId, fullName, studentId }: SeniorQRProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timestamp, setTimestamp] = useState(() => Date.now())
  const [timeLeft, setTimeLeft] = useState(30)

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimestamp(Date.now())
    setRefreshKey(prev => prev + 1)
    setTimeLeft(30)
    setTimeout(() => setIsRefreshing(false), 500)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleRefresh()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [handleRefresh])

  const qrValue = `${seniorId}:${timestamp}`

  const downloadQR = () => {
    const svg = document.getElementById('senior-qr') as HTMLElement
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `QR_${fullName}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in text-[#ffffff]">
      <div className="w-full flex items-center justify-between mb-4">
        <Link 
          href="/"
          className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#64748b] shadow-sm border border-slate-100 active:scale-90 transition-all"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-black uppercase tracking-widest text-[#1e293b]">Senior QR</h1>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#2563eb] shadow-sm border border-slate-100 active:scale-90 transition-all relative"
        >
          <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (125.6 * timeLeft) / 30}
              className="text-blue-500/20 transition-all duration-1000 ease-linear"
            />
          </svg>
        </button>
      </div>

      <div key={refreshKey} className="bg-white p-10 rounded-[4rem] shadow-2xl shadow-blue-900/10 flex flex-col items-center border border-slate-50 relative overflow-hidden w-full max-w-sm animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full -ml-16 -mb-16 blur-2xl" />

        <div className="relative z-10 bg-white p-5 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border-4 border-slate-50">
          <QRCodeSVG
            id="senior-qr"
            value={qrValue}
            size={240}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/PIC/Freshy Camp LOGO.png",
              x: undefined,
              y: undefined,
              height: 50,
              width: 50,
              excavate: true,
            }}
          />
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
           <Clock className="h-3 w-3" />
           Next Update in {timeLeft}s
        </div>

        <div className="mt-10 text-center relative z-10 w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-[#2563eb]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2563eb]">Verified Senior</span>
          </div>
          <h2 className="text-3xl font-black text-[#1e293b] tracking-tight">{fullName}</h2>
          <p className="text-[#64748b] font-bold mt-1 text-xs uppercase tracking-widest">ID: {studentId}</p>
          
          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center w-full px-2">
            <div className="text-left">
              <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Camp</p>
              <p className="text-xs font-black text-[#1e293b]">Freshy Camp 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Role</p>
              <p className="text-xs font-black text-[#2563eb] uppercase tracking-tighter">Senior Lead</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-sm">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-3 bg-[#2563eb] text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-500/30 active:scale-95 transition-all uppercase text-xs tracking-widest"
        >
          <Download className="h-5 w-5" />
          Download
        </button>
        <button
          className="flex items-center justify-center gap-3 bg-white text-[#1e293b] py-5 rounded-3xl font-black shadow-sm border border-slate-100 active:scale-95 transition-all uppercase text-xs tracking-widest"
        >
          <Share2 className="h-5 w-5 text-[#2563eb]" />
          Share
        </button>
      </div>

      <p className="text-center text-[10px] text-[#94a3b8] px-10 leading-relaxed font-black uppercase tracking-[0.15em]">
        Show this QR code to Freshmen to verify their attendance and award tokens.
      </p>
    </div>
  )
}

