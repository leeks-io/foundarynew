'use client'

import Link from 'next/link'
import { Search, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <nav className="fixed top-0 left-0 right-0 h-[60px] z-50 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a] flex items-center justify-between px-4 md:px-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-white font-bold text-xl flex items-center gap-2">
                        <span className="text-[#07da63]">⬡</span> Foundry
                    </span>
                </Link>
            </div>

            {/* Center: Nav Links */}
            <div className="hidden lg:flex items-center gap-8 font-dmsans text-[15px] font-medium text-[#6b7280]">
                <Link href="/dashboard" className="hover:text-white transition-colors">Explore</Link>
                <Link href="/dashboard/jobs" className="hover:text-white transition-colors">Jobs</Link>
                <Link href="/dashboard/services" className="hover:text-white transition-colors">Services</Link>
                <Link href="/dashboard/startups" className="hover:text-white transition-colors">Startups</Link>
                <Link href="/dashboard/communities" className="hover:text-white transition-colors">Communities</Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {!user ? (
                    <>
                        <Link
                            href="/auth"
                            className="hidden md:block text-white font-bold text-sm hover:opacity-80 transition-opacity px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth?mode=signup"
                            className="hidden md:block bg-[#07da63] text-black font-bold text-sm px-5 py-2 rounded-lg hover:bg-[#08f26e] transition-colors"
                        >
                            Join Foundry
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={handleSignOut}
                        className="hidden md:block border border-[#1a1a1a] text-[#6b7280] font-bold text-sm px-5 py-2 rounded-lg hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                )}
                <button className="flex items-center gap-2 border border-[#1a1a1a] hover:border-[#07da63]/50 px-4 py-2 rounded-lg text-sm font-bold transition-all text-white group">
                    <Wallet size={16} className="text-[#07da63] group-hover:scale-110 transition-transform" />
                    <span className="font-dmsans">Connect Wallet</span>
                </button>
            </div>
        </nav>
    )
}
