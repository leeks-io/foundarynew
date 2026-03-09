'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import {
    Rocket, Search, Filter, Globe,
    Users, TrendingUp, Sparkles, Loader2,
    ExternalLink, Building2
} from 'lucide-react'
import type { StartupWithFounder } from '@/types/database'

export default function StartupsPage() {
    const supabase = createSupabaseBrowserClient()
    const [startups, setStartups] = useState<StartupWithFounder[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchStartups = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('startups')
            .select('*, profiles(*)')
            .eq('is_public', true)
            .order('created_at', { ascending: false })

        if (search.trim()) {
            query = query.ilike('name', `%${search}%`)
        }

        const { data } = await query
        setStartups((data as StartupWithFounder[]) ?? [])
        setLoading(false)
    }, [search, supabase])

    useEffect(() => {
        const timer = setTimeout(fetchStartups, 300)
        return () => clearTimeout(timer)
    }, [fetchStartups])

    return (
        <div className="min-h-full bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Foundry Startups</h1>
                        <p className="text-zinc-500 text-base sm:text-lg">Discover and connect with the next generation of internet builders.</p>
                    </div>
                    <button className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Rocket className="w-4 h-4" />
                        Launch Startup
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by name, industry, or mission..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all shadow-inner"
                        />
                    </div>
                    <button className="px-5 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span className="font-medium text-sm">Filters</span>
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-700 animate-spin" />
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900/20 border-2 border-dashed border-zinc-800/50 rounded-[32px]">
                        <Building2 className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <h3 className="text-zinc-400 font-semibold text-lg">No startups found</h3>
                        <p className="text-zinc-600 text-sm mt-1">Be the first to list your vision.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {startups.map((startup) => (
                            <StartupCard key={startup.id} startup={startup} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StartupCard({ startup }: { startup: StartupWithFounder }) {
    return (
        <div className="group bg-zinc-900 border border-zinc-800/80 rounded-[24px] p-6 hover:border-zinc-500 transition-all duration-500 flex flex-col h-full relative overflow-hidden shadow-sm">
            {/* Background Glow */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-zinc-100/5 blur-3xl rounded-full" />

            <div className="flex-1 space-y-5">
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center p-2 shadow-xl shrink-0 group-hover:scale-105 transition-transform">
                        {startup.logo_url ? (
                            <img src={startup.logo_url} alt="" className="w-full h-full object-contain" />
                        ) : (
                            <Building2 className="w-6 h-6 text-zinc-500" />
                        )}
                    </div>
                    <span className="px-3 py-1 bg-zinc-800/80 text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-zinc-700/50">
                        {startup.stage || 'Idea'}
                    </span>
                </div>

                <div>
                    <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2 group-hover:text-zinc-200 transition-colors">
                        {startup.name}
                        {startup.industry && (
                            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        )}
                        <span className="text-zinc-500 text-xs font-normal">{startup.industry}</span>
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2">
                        {startup.tagline}
                    </p>
                </div>

                {startup.looking_for && startup.looking_for.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {startup.looking_for.slice(0, 3).map((item) => (
                            <span key={item} className="px-2.5 py-1 bg-zinc-800/40 text-zinc-500 rounded-lg text-[10px] font-medium border border-zinc-800">
                                🔍 {item}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                        {startup.profiles?.avatar_url ? (
                            <img src={startup.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[8px] font-bold text-zinc-600">F</span>
                        )}
                    </div>
                    <span className="text-zinc-500 text-xs font-semibold">{startup.profiles?.username}</span>
                </div>
                <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
