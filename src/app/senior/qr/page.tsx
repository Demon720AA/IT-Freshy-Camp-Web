import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SeniorQR from '@/components/SeniorQR'

export default async function SeniorQRPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'SENIOR') {
    return redirect('/')
  }

  return (
    <div className="mx-auto max-w-md min-h-screen relative overflow-x-hidden bg-[url('/PIC/My QR code/QRcode.png')] bg-cover bg-center bg-fixedshadow-[0_0_100px_rgba(0,0,0,0.1)]">
    {/* <div className="min-h-screen bg-slate-50 px-6 py-12"> */}
      <SeniorQR 
        seniorId={profile.id} 
        fullName={profile.full_name} 
        studentId={profile.student_id} 
      />
    </div>
  )
}
