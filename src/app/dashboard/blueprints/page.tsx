'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import {
    Library, Search, Sparkles, Download,
    Lock, ArrowUpRight, Filter, BookOpen,
    Loader2, Zap, Palette, Code, Terminal, Link
} from 'lucide-react'
import type { BlueprintWithAuthor } from '@/types/database'

const CATEGORIES = ['All', 'Development', 'Design', 'Growth', 'Templates', 'Web3']

export default function BlueprintsPage() {
    const supabase = createSupabaseBrowserClient()
    const [blueprints, setBlueprints] = useState<BlueprintWithAuthor[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCat, setActiveCat] = useState('All')

    const fetchBlueprints = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('blueprints')
            .select('*, profiles(*)')
            .order('created_at', { ascending: false })

        if (activeCat !== 'All') {
            query = query.eq('category', activeCat)
        }

        if (search.trim()) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        }

        const { data } = await query
        setBlueprints((data as BlueprintWithAuthor[]) ?? [])
        setLoading(false)
    }, [activeCat, search, supabase])

    useEffect(() => {
        const timer = setTimeout(fetchBlueprints, 300)
        return () => clearTimeout(timer)
    }, [fetchBlueprints])

    return (
        <div className="min-h-full bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

                {/* Hero Section */}
                <div className="relative mb-12 p-8 sm:p-12 rounded-[32px] bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Terminal className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-6 backdrop-blur">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            Premium Resources
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-[1.1]">Blueprints &<br />Execution Logs.</h1>
                        <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-8">
                            Download the exact playbooks, code architectures, and strategy documents used by high-performance builders.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search blueprints..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all font-medium backdrop-blur"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`shrink-0 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${activeCat === cat
                                ? 'bg-white text-black border-white shadow-lg'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-700 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blueprints.map((bp) => (
                            <BlueprintCard key={bp.id} blueprint={bp} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function BlueprintCard({ blueprint }: { blueprint: BlueprintWithAuthor }) {
    return (
        <div className="group bg-zinc-900/40 border border-zinc-800/80 rounded-[30px] p-6 hover:bg-zinc-900/80 hover:border-zinc-500 transition-all duration-500 flex flex-col h-full shadow-lg">
            <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center p-2.5 shadow-inner group-hover:bg-zinc-700 transition-colors">
                        {blueprint.category === 'Development' ? <Code className="w-full h-full text-zinc-400" /> :
                            blueprint.category === 'Design' ? <Palette className="w-full h-full text-zinc-400" /> :
                                <Zap className="w-full h-full text-zinc-400" />}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-full">
                        <Link className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {blueprint.price ? `$${blueprint.price}` : 'Free'}
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold text-xl mb-3 group-hover:text-zinc-100 transition-colors leading-tight">
                        {blueprint.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                        {blueprint.description}
                    </p>
                </div>

                {blueprint.tags && blueprint.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {blueprint.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-3">
                <button className="flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-[18px] text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn">
                    {blueprint.is_premium ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    {blueprint.is_premium ? 'Unlock' : 'Download'}
                </button>
                <button className="p-3.5 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 rounded-[18px] transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
