'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/context/RoleContext'
import {
    Home,
    Briefcase,
    Code2,
    Rocket,
    Users,
    MessageSquare,
    Bell,
    User,
    Settings,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
    const pathname = usePathname()
    const { role } = useRole()

    const commonNav = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    ]

    const roleNav = {
        jobseeker: [
            { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
            { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
            { name: 'Portfolio', href: '/dashboard/portfolio', icon: User },
        ],
        freelancer: [
            { name: 'Services', href: '/dashboard/services', icon: Code2 },
            { name: 'Orders', href: '/dashboard/orders', icon: Rocket },
            { name: 'Earnings', href: '/dashboard/earnings', icon: Code2 },
        ],
        founder: [
            { name: 'Startups', href: '/dashboard/startups', icon: Rocket },
            { name: 'Hiring', href: '/dashboard/hiring', icon: Users },
            { name: 'Team', href: '/dashboard/team', icon: Users },
        ]
    }

    const navItems = [...commonNav, ...roleNav[role]]

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0B1221]/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-30">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-10 group">
                    <div className="p-1.5 bg-primary rounded-lg glow-primary group-hover:scale-105 transition-transform">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Foundry</span>
                </Link>


                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-white")} />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                <Link
                    href="/premium"
                    className="block p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-[#0B0F19] text-center group overflow-hidden relative"
                >
                    <div className="relative z-10">
                        <div className="text-xs font-bold uppercase tracking-wider mb-1">Upgrade</div>
                        <div className="text-sm font-black">GET PREMIUM</div>
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </Link>

                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl transition-colors">
                    <Settings className="w-5 h-5 text-white/40" />
                    <span className="text-sm font-medium text-white/40">Settings</span>
                </div>
            </div>
        </aside>
    )
}
