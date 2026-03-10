import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight, Briefcase, Wrench, Rocket, Users, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-white selection:text-black">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 h-16 bg-zinc-950/50 backdrop-blur-xl border-b border-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
            <span className="text-black font-black text-sm">F</span>
          </div>
          <span className="font-bold tracking-tight text-white text-lg">Foundry</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          {['Explore', 'Jobs', 'Services', 'Startups', 'Communities'].map(item => (
            <Link key={item} href={`/dashboard/${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/auth" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/auth" className="px-5 py-2 bg-white text-black rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
            Join Foundry
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 sm:py-32 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-zinc-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Verified network for builders
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
            Build, Launch &
            <br />
            <span className="text-zinc-600 bg-clip-text">Grow Together</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The definitive network for builders. Find jobs, offer services, launch ventures, and join hyper-growth communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all text-base shadow-2xl shadow-white/5"
            >
              Get started free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard/explore"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all text-base backdrop-blur-sm"
            >
              Browse Network
            </Link>
          </div>
        </div>

        {/* Live stats */}
        {(userCount ?? 0) > 0 && (
          <div className="mt-20 sm:mt-32 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16 w-full max-w-4xl border-t border-zinc-900 pt-16">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center group">
                <p className="text-3xl sm:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300">{value.toLocaleString()}</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-600 uppercase tracking-widest mt-2">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Feature cards */}
        <div className="mt-24 sm:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {[
            { icon: Briefcase, label: 'Jobs', desc: 'Find your next big role at a top startup.', href: '/dashboard/jobs', color: 'bg-blue-500' },
            { icon: Wrench, label: 'Services', desc: 'Monetize your skills or hire the best.', href: '/dashboard/services', color: 'bg-purple-500' },
            { icon: Rocket, label: 'Startups', desc: 'Launch and scale your venture with us.', href: '/dashboard/startups', color: 'bg-orange-500' },
            { icon: Users, label: 'Communities', desc: 'Real conversations with real builders.', href: '/dashboard/communities', color: 'bg-green-500' },
          ].map(({ icon: Icon, label, desc, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group relative flex flex-col gap-4 p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-left overflow-hidden backdrop-blur-sm"
            >
              <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">{label}</h3>
                <p className="text-zinc-500 text-sm mt-2 leading-relaxed font-medium">{desc}</p>
              </div>
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-zinc-500" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 px-4 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-600 text-sm font-medium z-10">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-[10px]">F</span>
          </div>
          <span>© {new Date().getFullYear()} Foundry Network</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/auth" className="hover:text-white transition-colors">Sign in</Link>
          <Link href="/auth" className="hover:text-white transition-colors">Join Network</Link>
          <Link href="/dashboard/premium" className="hover:text-white transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" /> Premium
          </Link>
        </div>
      </footer>
    </div>
  )
}
