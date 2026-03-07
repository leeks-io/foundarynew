import Link from 'next/link'
import { Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary rounded-lg glow-primary group-hover:scale-110 transition-transform">
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Foundry</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
                    <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
                    <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                    <Link href="/startups" className="hover:text-white transition-colors">Startups</Link>
                    <Link href="/communities" className="hover:text-white transition-colors">Communities</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/signin" className="text-sm font-medium hover:text-white transition-colors">Sign In</Link>
                    <Link
                        href="/join"
                        className="px-5 py-2.5 bg-primary rounded-full text-sm font-semibold glow-primary hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Join Foundry
                    </Link>
                </div>
            </div>
        </nav>
    )
}
