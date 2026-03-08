import Link from 'next/link'
import { Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/40 backdrop-blur-xl border-b border-white/5 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-primary rounded-lg glow-primary group-hover:scale-105 transition-transform">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Foundry</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-white/50">
                    <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
                    <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
                    <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                    <Link href="/startups" className="hover:text-white transition-colors">Startups</Link>
                    <Link href="/communities" className="hover:text-white transition-colors">Communities</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/signin" className="hidden sm:inline-block text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">Sign In</Link>
                    <Link
                        href="/join"
                        className="px-6 py-2 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest glow-primary hover:bg-primary/90 transition-all active:scale-95 shadow-xl"
                    >
                        Join Foundry
                    </Link>
                </div>
            </div>
        </nav>
    )
}
