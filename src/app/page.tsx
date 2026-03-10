import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight, Briefcase, Wrench, Rocket, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch real stats
  const [
    { count: userCount },
    { count: jobCount },
    { count: serviceCount },
    { count: startupCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('startups').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Builders', value: userCount ?? 0 },
    { label: 'Open Jobs', value: jobCount ?? 0 },
    { label: 'Services', value: serviceCount ?? 0 },
    { label: 'Startups', value: startupCount ?? 0 },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <span className="font-semibold tracking-tight text-white">Foundry</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/dashboard/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/dashboard/jobs" className="hover:text-white transition-colors">Jobs</Link>
          <Link href="/dashboard/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/dashboard/startups" className="hover:text-white transition-colors">Startups</Link>
          <Link href="/dashboard/communities" className="hover:text-white transition-colors">Communities</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/auth" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/auth" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">
            Join Foundry
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            The network for builders
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Build, Launch &
            <br />
            <span className="text-zinc-500">Grow Together</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Foundry connects founders, freelancers, and builders. Find jobs, offer services, launch your startup, and join communities that move fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors text-sm sm:text-base"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/explore"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors text-sm sm:text-base"
            >
              Browse the network
            </Link>
          </div>
        </div>

        {/* Live stats */}
        {(userCount ?? 0) > 0 && (
          <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-2xl">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{value.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Feature cards */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {[
            { icon: Briefcase, label: 'Jobs', desc: 'Full-time, freelance, and contract roles', href: '/dashboard/jobs', color: 'text-blue-400' },
            { icon: Wrench, label: 'Services', desc: 'Hire skilled freelancers for any project', href: '/dashboard/services', color: 'text-purple-400' },
            { icon: Rocket, label: 'Startups', desc: 'Discover and support early-stage ventures', href: '/dashboard/startups', color: 'text-orange-400' },
            { icon: Users, label: 'Communities', desc: 'Find your people and grow together', href: '/dashboard/communities', color: 'text-green-400' },
          ].map(({ icon: Icon, label, desc, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col gap-3 p-5 bg-zinc-950 border border-zinc-800/80 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left"
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <div>
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors mt-auto" />
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-xs">
        <p>© {new Date().getFullYear()} Foundry Network</p>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="hover:text-zinc-400 transition-colors">Sign in</Link>
          <Link href="/auth" className="hover:text-zinc-400 transition-colors">Join</Link>
        </div>
      </footer>
    </div>
  )
}
