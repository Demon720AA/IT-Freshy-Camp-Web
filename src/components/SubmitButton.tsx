'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  label: string
  loadingLabel?: string
  className?: string
}

export function SubmitButton({ label, loadingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={className || "w-full rounded-2xl bg-[#3244bb] py-4 font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"}
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingLabel || "Processing..."}
        </>
      ) : (
        label
      )}
    </button>
  )
}
