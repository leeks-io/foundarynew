'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home, Search, Briefcase, ShoppingCart, Rocket,
    Lightbulb, Users, MessageSquare, Bell, User,
    Settings, Sparkles, MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Sidebar() {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                const { data } = await supabase
                    .from('users')
                    .select('username, profiles(profile_image)')
                    .eq('id', authUser.id)
                    .single()
                setUser(data)
            }
        }
        getUser()
    }, [supabase])

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Explore', href: '/dashboard/explore', icon: Search },
        { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
        { name: 'Services', href: '/dashboard/services', icon: ShoppingCart },
        { name: 'Startups', href: '/dashboard/startups', icon: Rocket },
        { name: 'Blueprints', href: '/dashboard/blueprints', icon: Lightbulb },
        { name: 'Communities', href: '/dashboard/communities', icon: Users },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 3 },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 5 },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[275px] bg-black border-r border-[#1a1a1a] flex flex-col z-40 hidden xl:flex px-4 py-4">
            {/* Top: Logo */}
            <div className="mb-6 px-4">
                <Link href="/" className="text-white font-bold text-2xl flex items-center gap-2">
                    <span className="text-[#07da63]">⬡</span>
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-full transition-all group w-fit pr-8",
                                isActive ? "text-white" : "text-white/90 hover:bg-[#111111]"
                            )}
                        >
                            <div className="relative">
                                <item.icon
                                    size={26}
                                    className={cn(isActive ? "text-[#07da63] stroke-[2.5px]" : "group-hover:text-white")}
                                />
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-[#07da63] text-black text-[10px] font-bold px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-black">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={cn("text-xl", isActive ? "font-bold" : "font-normal")}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-4">
                {/* Premium Upgrade */}
                <Link
                    href="/dashboard/premium"
                    className="flex items-center gap-3 w-full border border-[#07da63] text-[#07da63] hover:bg-[#07da63]/5 px-4 py-3 rounded-full transition-all group"
                >
                    <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Upgrade to Premium</span>
                </Link>

                {/* User Mini Profile */}
                <div className="flex items-center justify-between p-3 rounded-full hover:bg-[#111111] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] overflow-hidden">
                            <img src={user?.profiles?.profile_image || `https://i.pravatar.cc/150?u=${user?.username}`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-[15px] leading-tight group-hover:underline">{user?.username || 'Loading...'}</span>
                            <span className="text-[#6b7280] text-sm leading-tight">@{user?.username || 'foundry'}</span>
                        </div>
                    </div>
                    <MoreHorizontal size={18} className="text-[#6b7280]" />
                </div>
            </div>
        </aside>
    )
}
