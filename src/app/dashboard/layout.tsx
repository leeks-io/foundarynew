'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#07da63]/30">
            <Navbar />
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex justify-center xl:pl-[275px] pt-[60px] min-h-screen">
                <main className="w-full max-w-[1050px] flex">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav Placeholder (optional future) */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-[#1a1a1a] flex items-center justify-around z-50">
                {/* We can add mobile nav icons here later if needed */}
            </div>
        </div>
    )
}
