'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import {
    Users, Search, Plus, Globe,
    MessageCircle, TrendingUp, Sparkles,
    Loader2, ArrowUpRight, Hash
} from 'lucide-react'
import type { CommunityWithCreator } from '@/types/database'

export default function CommunitiesPage() {
    const supabase = createSupabaseBrowserClient()
    const [communities, setCommunities] = useState<CommunityWithCreator[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchCommunities = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('communities')
            .select('*, profiles(*)')
            .eq('is_public', true)
            .order('member_count', { ascending: false })

        if (search.trim()) {
            query = query.ilike('name', `%${search}%`)
        }

        const { data } = await query
        setCommunities((data as CommunityWithCreator[]) ?? [])
        setLoading(false)
    }, [search, supabase])

    useEffect(() => {
        const timer = setTimeout(fetchCommunities, 300)
        return () => clearTimeout(timer)
    }, [fetchCommunities])

    return (
        <div className="min-h-full bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tighter">Guilds & Communities</h1>
                        <p className="text-zinc-500 text-lg leading-relaxed">Join specialized groups to share knowledge, build projects, and grow together.</p>
                    </div>
                    <button className="shrink-0 flex items-center gap-2 px-6 py-3.5 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                        <Plus className="w-5 h-5" />
                        Create Community
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-12">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search communities (e.g. 'BuildSpace', 'FounderHub')..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-[24px] pl-14 pr-6 py-5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all text-lg shadow-inner"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {communities.map((comm) => (
                            <CommunityCard key={comm.id} community={comm} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function CommunityCard({ community }: { community: CommunityWithCreator }) {
    return (
        <div className="group bg-zinc-900/50 border border-zinc-800/80 rounded-[32px] overflow-hidden hover:border-zinc-500 transition-all duration-500 flex flex-col shadow-sm">
            {/* Header/Banner Area */}
            <div className="h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
                <div className="absolute -bottom-6 left-6">
                    <div className="w-16 h-16 rounded-[20px] bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        {community.avatar_url ? (
                            <img src={community.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-8 h-8 text-zinc-600" />
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 pt-10 flex-1 flex flex-col">
                <div className="flex-1 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold text-xl group-hover:text-zinc-100 transition-colors">
                            {community.name}
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Active
                        </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                        {community.description || 'A collaborative space for builders and creators.'}
                    </p>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-zinc-800/50">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-zinc-600">U</span>
                            </div>
                        ))}
                        <div className="w-6 h-6 bg-zinc-800 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-zinc-400">+{community.member_count}</span>
                        </div>
                    </div>
                    <button className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 group/btn">
                        Join
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover/btn:text-white transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    )
}
