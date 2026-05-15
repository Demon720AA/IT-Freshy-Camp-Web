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
    <div className="flex flex-col items-center gap-8 animate-fade-in text-[#1e293b]">
      <div className="w-full flex items-center justify-between mb-2">
        <Link 
          href="/"
          className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#64748b] active:scale-95 transition-all"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-black">My QR Code</h1>
        <div className="w-12"></div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-blue-100 flex flex-col items-center border border-slate-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative bg-white p-6 rounded-[2rem] shadow-inner border-8 border-slate-100">
          <QRCodeSVG
            id="senior-qr"
            value={seniorId}
            size={220}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight">{fullName}</h2>
          <p className="text-[#2563eb] font-bold mt-1 text-sm">Student ID: {studentId}</p>
          <div className="mt-6 inline-flex bg-blue-50 text-[#2563eb] px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-blue-100">
            Official Senior
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-3 bg-[#2563eb] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          <Download className="h-5 w-5" />
          Save
        </button>
        <button
          className="flex items-center justify-center gap-3 bg-white text-[#1e293b] py-4 rounded-2xl font-black shadow-sm border border-slate-200 active:scale-95 transition-all"
        >
          <Share2 className="h-5 w-5 text-[#2563eb]" />
          Share
        </button>
      </div>

      <p className="text-center text-sm text-[#64748b] px-8 leading-relaxed font-medium">
        Show this QR code to Freshmen to let them collect their orientation tokens.
      </p>
    </div>
  )
}
