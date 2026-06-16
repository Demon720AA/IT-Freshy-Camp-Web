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
    <div className="min-h-screen relative px-6 py-12 flex flex-col items-center">
      <div className="fixed inset-0 bg-[url('/PIC/QRcode/QRcode.png')] bg-cover bg-center bg-no-repeat -z-10" />
      <SeniorQR 
        seniorId={profile.id} 
        fullName={profile.full_name} 
        studentId={profile.student_id} 
      />
    </div>
  )
}
