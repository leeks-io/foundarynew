'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Profile } from '@/types/database'
import {
    Home, Compass, Briefcase, Wrench, Rocket, Users,
    MessageSquare, Bell, User, Settings, Crown,
    LogOut, Menu, X, BookOpen
} from 'lucide-react'

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home', exact: true },
    { href: '/dashboard/explore', icon: Compass, label: 'Explore' },
    { href: '/dashboard/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/dashboard/services', icon: Wrench, label: 'Services' },
    { href: '/dashboard/startups', icon: Rocket, label: 'Startups' },
    { href: '/dashboard/blueprints', icon: BookOpen, label: 'Blueprints' },
    { href: '/dashboard/communities', icon: Users, label: 'Communities' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
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

            // Auto-create profile if missing
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

    const SidebarContent = () => (
        <aside className="flex flex-col h-full w-64 bg-zinc-950 border-r border-zinc-800/80">
            {/* Logo */}
            <div className="px-5 py-4 border-b border-zinc-800/80">
                <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-black font-bold text-sm leading-none">F</span>
                    </div>
                    <span className="text-white font-semibold tracking-tight">Foundry</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {navItems.map(({ href, icon: Icon, label, exact }) => {
                    const active = isActive(href, exact)
                    return (
                        <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-zinc-800/80 space-y-0.5">
                {profile?.is_premium && (
                    <div className="flex items-center gap-2 px-3 py-1.5">
                        <Crown className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs text-yellow-500 font-medium">Premium Member</span>
                    </div>
                )}
                <Link href="/dashboard/profile" onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard/profile') ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                        }`}
                >
                    {profile?.avatar_url
                        ? <img src={profile.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                        : <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center shrink-0"><span className="text-xs text-zinc-300">{initials}</span></div>
                    }
                    <span className="truncate">{profile?.full_name || profile?.username || 'Profile'}</span>
                </Link>
                <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard/settings') ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                        }`}
                >
                    <Settings className="w-4 h-4 shrink-0" />
                    Settings
                </Link>
                <button onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition-all"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </aside>
    )

    return (
        <div className="flex h-screen bg-zinc-900 overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden md:flex shrink-0">
                <SidebarContent />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative z-10">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile topbar */}
                <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800/80 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="p-1 text-zinc-400 hover:text-white transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                            <span className="text-black font-bold text-xs">F</span>
                        </div>
                        <span className="text-white font-semibold text-sm">Foundry</span>
                    </Link>
                    <Link href="/dashboard/profile">
                        {profile?.avatar_url
                            ? <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                            : <div className="w-7 h-7 bg-zinc-700 rounded-full flex items-center justify-center">
                                <span className="text-xs text-zinc-300 font-medium">{initials}</span>
                            </div>
                        }
                    </Link>
                </header>

                {/* Page */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
