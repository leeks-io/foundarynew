'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import WorkspaceSwitcher from '@/components/dashboard/WorkspaceSwitcher'
import { Bell, Search } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Sidebar />

            <div className="pl-64 flex flex-col min-h-screen">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#0B0F19]/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-8 w-full max-w-2xl">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search for builds, people, or services..."
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-primary/50 transition-colors outline-none"
                            />
                        </div>
                        <WorkspaceSwitcher />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative">
                            <Bell className="w-5 h-5 text-white/60" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-[#0B0F19]" />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-[1px]">
                            <div className="w-full h-full rounded-xl bg-[#0B0F19] flex items-center justify-center font-bold text-xs">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10 flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
