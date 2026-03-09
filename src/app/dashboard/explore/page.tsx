import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Users, Rocket, ShoppingCart, Lightbulb, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useBuilders } from '@/hooks/useBuilders'
import { useStartups } from '@/hooks/useStartups'
import { useServices } from '@/hooks/useServices'
import { cn } from '@/lib/utils'

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const { data: trendingBuilders, isLoading: buildersLoading } = useBuilders(6)
    const { data: hotServices, isLoading: servicesLoading } = useServices()
    const { data: newStartups, isLoading: startupsLoading } = useStartups()

    const loading = buildersLoading || servicesLoading || startupsLoading

    return (
        <div className="flex-1 min-h-screen bg-black border-x border-[#1a1a1a] max-w-[600px]">
            {/* Header */}
            <header className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a] p-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                    <input
                        type="text"
                        placeholder="Search builders, services, or startups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#16181c] border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                    />
                </div>
            </header>

            <div className="pb-20">
                {/* Trending Builders Section */}
                <section className="p-6 border-b border-[#1a1a1a]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="text-[#07da63]" size={20} />
                            <h2 className="text-xl font-bold">Trending Builders</h2>
                        </div>
                        <Link href="/dashboard" className="text-xs font-bold text-[#07da63] hover:underline">View All</Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-16 bg-[#0d0d0d] animate-pulse rounded-xl" />
                            ))
                        ) : trendingBuilders && trendingBuilders.length > 0 ? (
                            trendingBuilders.map((builder: any) => (
                                <div key={builder.username} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#0d0d0d] transition-colors border border-transparent hover:border-[#1a1a1a] group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1a1a1a]">
                                            <img
                                                src={builder.profiles?.profile_image || `https://i.pravatar.cc/150?u=${builder.username}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold group-hover:underline">{builder.username}</p>
                                            <p className="text-[#6b7280] text-xs uppercase tracking-widest font-bold">{builder.role || 'Builder'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right px-4 py-1.5 bg-[#07da63]/5 rounded-lg border border-[#07da63]/10">
                                        <p className="text-[#07da63] font-black text-lg">{builder.builder_score}</p>
                                        <p className="text-[10px] text-[#07da63]/60 font-bold uppercase tracking-tighter">Score</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#6b7280] text-sm text-center py-4">No trending builders yet.</p>
                        )}
                    </div>
                </section>

                {/* Hot Services Section */}
                <section className="p-6 border-b border-[#1a1a1a]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="text-[#07da63]" size={20} />
                            <h2 className="text-xl font-bold">Hot Services</h2>
                        </div>
                        <Link href="/dashboard/services" className="text-xs font-bold text-[#07da63] hover:underline">Marketplace</Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {loading ? (
                            Array(2).fill(0).map((_, i) => (
                                <div key={i} className="aspect-square bg-[#0d0d0d] animate-pulse rounded-2xl" />
                            ))
                        ) : hotServices && hotServices.length > 0 ? (
                            hotServices.map((service: any) => (
                                <Link href={`/dashboard/services`} key={service.id} className="group flex flex-col bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#07da63]/30 transition-all">
                                    <div className="aspect-video bg-[#1a1a1a] relative">
                                        {service.images?.[0] ? (
                                            <img src={service.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#07da63]/20">
                                                <ShoppingCart size={40} />
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[#07da63] text-xs font-bold">
                                            {service.price_usdc} USDC
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="font-bold text-sm line-clamp-1 group-hover:text-[#07da63] transition-colors">{service.title}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star size={10} className="text-[#07da63] fill-[#07da63]" />
                                            <span className="text-[10px] font-bold text-white">{service.rating || '5.0'}</span>
                                            <span className="text-[10px] text-[#6b7280]">by @{service.users?.username}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-[#6b7280] text-sm text-center py-4 col-span-2">No hot services found.</p>
                        )}
                    </div>
                </section>

                {/* New Startups Section */}
                <section className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Rocket className="text-[#07da63]" size={20} />
                            <h2 className="text-xl font-bold">New Startups</h2>
                        </div>
                        <Link href="/dashboard/startups" className="text-xs font-bold text-[#07da63] hover:underline">Startup Hub</Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array(2).fill(0).map((_, i) => (
                                <div key={i} className="h-24 bg-[#0d0d0d] animate-pulse rounded-2xl" />
                            ))
                        ) : newStartups && newStartups.length > 0 ? (
                            newStartups.map((startup: any) => (
                                <Link href="/dashboard/startups" key={startup.id} className="flex items-center gap-4 p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl hover:bg-[#111111] transition-all group">
                                    <div className="w-16 h-16 rounded-xl bg-[#16181c] flex items-center justify-center border border-[#1a1a1a] shrink-0 text-[#07da63]">
                                        {startup.logo_url ? <img src={startup.logo_url} className="w-10 h-10 object-contain" /> : <Rocket size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-lg group-hover:text-[#07da63] transition-colors">{startup.name}</h4>
                                            <span className="text-[10px] bg-[#1a1a1a] text-[#07da63] font-bold px-2 py-0.5 rounded border border-[#07da63]/20 uppercase tracking-widest">{startup.stage}</span>
                                        </div>
                                        <p className="text-[#6b7280] text-sm line-clamp-1 mt-0.5">{startup.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-bold text-[#6b7280] uppercase border border-[#1a1a1a] px-1.5 py-0.5 rounded">{startup.industry}</span>
                                            <span className="text-[10px] font-bold text-[#07da63]">{startup.asking_price_usdc} USDC</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-[#6b7280] text-sm text-center py-4">No new startups posted.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
