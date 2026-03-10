'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Profile } from '@/types/database'
import {
    Home, Compass, Briefcase, Wrench, Rocket, Users,
    MessageSquare, Bell, User, Settings, Crown,
    LogOut, Menu, X, BookOpen, Search
} from 'lucide-react'

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Feed', exact: true },
    { href: '/dashboard/explore', icon: Search, label: 'Explore' },
    { href: '/dashboard/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/dashboard/services', icon: Wrench, label: 'Services' },
    { href: '/dashboard/startups', icon: Rocket, label: 'Startups' },
    { href: '/dashboard/blueprints', icon: BookOpen, label: 'Blueprints' },
]

const tertiaryItems = [
    { href: '/dashboard/communities', icon: Users, label: 'Communities' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createSupabaseBrowserClient()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.replace('/auth'); return }

            let { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()

            if (!data) {
                const meta = session.user.user_metadata
                const email = session.user.email ?? ''
                const username = email.split('@')[0].toLowerCase() + '_' + session.user.id.slice(0, 6)
                await supabase.from('profiles').insert({
                    id: session.user.id,
                    username,
                    full_name: meta?.full_name ?? meta?.name ?? email.split('@')[0],
                    avatar_url: meta?.avatar_url ?? null,
                    skills: [],
                    is_premium: false,
                }).catch(() => null)
                const { data: created } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
                data = created
            }

            setProfile(data)
            setLoading(false)
        }
        init()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) router.replace('/auth')
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.replace('/auth')
    }

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))

    const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden text-zinc-300">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 shrink-0">
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                            <span className="text-black font-black text-sm">F</span>
                        </div>
                        <span className="text-white font-bold tracking-tight text-lg">Foundry</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
                    <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 mt-4">Platform</p>
                    {navItems.map(({ href, icon: Icon, label, exact }) => {
                        const active = isActive(href, exact)
                        return (
                            <Link key={href} href={href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${active ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-zinc-600'}`} />
                                {label}
                            </Link>
                        )
                    })}

                    <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 mt-8">Social</p>
                    {tertiaryItems.map(({ href, icon: Icon, label }) => {
                        const active = isActive(href)
                        return (
                            <Link key={href} href={href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-zinc-600'}`} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-900 space-y-1">
                    <Link href="/dashboard/profile"
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard/profile') ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
                    >
                        {profile?.avatar_url
                            ? <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover border border-zinc-800" />
                            : <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700"><span className="text-[10px] text-zinc-400">{initials}</span></div>
                        }
                        <span className="truncate">{profile?.full_name || profile?.username || 'Profile'}</span>
                    </Link>
                    <Link href="/dashboard/settings"
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard/settings') ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-900 relative">
                {/* Desktop Top Header (Hidden on Mobile) */}
                <header className="hidden lg:flex items-center justify-between h-16 px-8 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium capitalize">
                        {pathname.split('/').slice(1).map((part, i, arr) => (
                            <div key={part} className="flex items-center gap-2">
                                <span className={i === arr.length - 1 ? 'text-white' : ''}>{part}</span>
                                {i < arr.length - 1 && <span className="text-zinc-700">/</span>}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/notifications" className="p-2 text-zinc-500 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-zinc-900" />
                        </Link>
                        {profile?.is_premium && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-full border border-zinc-700">
                                <Crown className="w-3.5 h-3.5 text-yellow-500" />
                                <span className="text-[10px] font-bold tracking-wider text-yellow-500 uppercase">Premium</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Mobile Top Header */}
                <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-zinc-950 border-b border-zinc-900 shrink-0 z-20">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-white/10">
                            <span className="text-black font-black text-xs">F</span>
                        </div>
                        <span className="text-white font-bold tracking-tight text-sm">Foundry</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/notifications" className="p-2 text-zinc-400 relative">
                            <Bell className="w-5 h-5" />
                        </Link>
                        <Link href="/dashboard/profile">
                            {profile?.avatar_url
                                ? <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-zinc-800" />
                                : <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700"><span className="text-[10px] text-zinc-400">{initials}</span></div>
                            }
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 scrollbar-hide">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 px-2 flex items-center justify-around z-30">
                    {[
                        { href: '/dashboard', icon: Home, label: 'Feed', exact: true },
                        { href: '/dashboard/explore', icon: Search, label: 'Explore' },
                        { href: '/dashboard/blueprints', icon: BookOpen, label: 'Blueprints' },
                        { href: '/dashboard/messages', icon: MessageSquare, label: 'Chat' },
                        { href: '/dashboard/settings', icon: Settings, label: 'Menu' },
                    ].map(({ href, icon: Icon, label, exact }) => {
                        const active = isActive(href, exact)
                        return (
                            <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 min-w-[64px]">
                                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-600'}`} />
                                <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
