import Sidebar from '@/components/dashboard/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#07da63]/30">
            <Navbar />
            <Sidebar />

            <div className="flex justify-center xl:pl-[275px] pt-[60px] min-h-screen">
                <main className="w-full max-w-[1050px] flex">
                    {children}
                </main>
            </div>

            <div className="xl:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-[#1a1a1a] flex items-center justify-around z-50">
            </div>
        </div>
    )
}
