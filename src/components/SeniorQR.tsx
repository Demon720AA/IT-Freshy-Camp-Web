'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

interface SeniorQRProps {
  seniorId: string
  fullName: string
  studentId: string
}

export default function SeniorQR({ seniorId, fullName, studentId }: SeniorQRProps) {
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
    <div className="flex flex-col items-center gap-8 animate-fade-in text-white">
      <div className="w-full flex items-center justify-between mb-2">
        <Link 
          href="/"
          className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#3bc4d2] active:scale-95 transition-all"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-black text-white">My QR Code</h1>
        <div className="w-12"></div>
      </div>

      <div className="bg-white/5 p-8 rounded-[3rem] shadow-2xl shadow-black/40 flex flex-col items-center border border-white/10 relative overflow-hidden backdrop-blur-xl">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#3bc4d2]/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl opacity-50"></div>

        <div className="relative bg-white p-6 rounded-[2rem] shadow-inner border-8 border-white/10">
          <QRCodeSVG
            id="senior-qr"
            value={seniorId}
            size={220}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{fullName}</h2>
          <p className="text-[#3bc4d2] font-bold mt-1 text-sm">Student ID: {studentId}</p>
          <div className="mt-6 inline-flex bg-[#3bc4d2]/10 text-[#3bc4d2] px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-[#3bc4d2]/20">
            Official Senior
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-3 bg-[#3bc4d2] text-[#3244bb] py-4 rounded-2xl font-black shadow-lg shadow-[#3bc4d2]/20 active:scale-95 transition-all"
        >
          <Download className="h-5 w-5" />
          Save
        </button>
        <button
          className="flex items-center justify-center gap-3 bg-white/5 text-white py-4 rounded-2xl font-black shadow-sm border border-white/10 active:scale-95 transition-all"
        >
          <Share2 className="h-5 w-5 text-[#3bc4d2]" />
          Share
        </button>
      </div>

      <p className="text-center text-sm text-slate-400 px-8 leading-relaxed font-medium">
        Show this QR code to Freshmen to let them collect their orientation tokens.
      </p>
    </div>
  )
}
