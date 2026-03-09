'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import {
    Search, Shield, Zap, TrendingUp, Clock,
    Tag, Loader2, Star, CreditCard, ChevronRight
} from 'lucide-react'
import type { ServiceWithSeller } from '@/types/database'

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Consulting']

export default function ServicesPage() {
    const supabase = createSupabaseBrowserClient()
    const [services, setServices] = useState<ServiceWithSeller[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const fetchServices = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('services')
            .select('*, profiles(*)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (activeCategory !== 'All') {
            query = query.eq('category', activeCategory)
        }

        if (search.trim()) {
            query = query.ilike('title', `%${search}%`)
        }

        const { data } = await query
        setServices((data as ServiceWithSeller[]) ?? [])
        setLoading(false)
    }, [activeCategory, search, supabase])

    useEffect(() => {
        const timer = setTimeout(fetchServices, 300)
        return () => clearTimeout(timer)
    }, [fetchServices])

    return (
        <div className="min-h-full bg-zinc-950">
            {/* Search Header */}
            <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Marketplace</h1>
                        <p className="text-zinc-400 text-sm sm:text-base">Find experts to help scale your next big idea.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search services (e.g. 'logos', 'react expert')..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors shadow-inner"
                            />
                        </div>
                        <button className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors shadow-lg">
                            Post Service
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat
                                        ? 'bg-zinc-100 text-black'
                                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl border-dashed">
                        <Zap className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500">No services found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ServiceCard({ service }: { service: ServiceWithSeller }) {
    return (
        <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col h-full">
            <div className="p-5 flex-1 flex flex-col">
                {/* Category & Badge */}
                <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded-md text-[10px] uppercase font-bold tracking-wider">
                        {service.category || 'General'}
                    </span>
                    <div className="flex items-center text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold ml-1 text-zinc-300">4.9</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2 leading-snug group-hover:text-zinc-100 italic">
                    {service.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                    {service.description}
                </p>

                {/* Seller Info */}
                <div className="flex items-center gap-3 py-4 border-t border-zinc-800/50">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                        {service.profiles?.avatar_url && (
                            <img src={service.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-zinc-300 text-xs font-medium truncate">
                            {service.profiles?.full_name || service.profiles?.username}
                        </p>
                        <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-tighter">Verified Provider</p>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div>
                        <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-0.5">Starting at</span>
                        <span className="text-white font-bold text-xl">${service.price}</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors group/btn">
                        View Details
                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    )
}
