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
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="w-full flex items-center justify-between mb-2">
        <Link 
          href="/"
          className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#64748b] active:scale-95 transition-all"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-black text-[#1e293b]">My QR Code</h1>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-blue-100 flex flex-col items-center border border-slate-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative bg-white p-4 rounded-3xl shadow-inner border border-slate-100">
          <QRCodeSVG
            id="senior-qr"
            value={seniorId}
            size={240}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/favicon.ico",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-black text-[#1e293b]">{fullName}</h2>
          <p className="text-[#94a3b8] font-medium mt-1">Student ID: {studentId}</p>
          <div className="mt-4 bg-blue-50 text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
            Official Senior
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-3 bg-[#2563EB] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all"
        >
          <Download className="h-5 w-5" />
          Save Image
        </button>
        <button
          className="flex items-center justify-center gap-3 bg-white text-[#1e293b] py-4 rounded-2xl font-bold shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <Share2 className="h-5 w-5 text-[#2563EB]" />
          Share
        </button>
      </div>

      <p className="text-center text-sm text-[#94a3b8] px-8 leading-relaxed">
        Show this QR code to Freshmen to let them collect their orientation tokens.
      </p>
    </div>
  )
}
