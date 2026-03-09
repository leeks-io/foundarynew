'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, SlidersHorizontal, Sparkles, Filter,
    Star, Clock, ShieldCheck, X, ArrowRight, Zap, CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ServiceCard from '@/components/marketplace/ServiceCard'
import Link from 'next/link'
import { useServices } from '@/hooks/useServices'
import { ServiceSkeleton } from '@/components/skeletons/ServiceSkeleton'

export default function ServicesPage() {
    const [selectedService, setSelectedService] = useState<any>(null)
    const [activeCategory, setActiveCategory] = useState('All')
    const categories = ['All', 'UI/UX Design', 'Web Dev', 'Smart Contracts', 'AI Tools', 'Marketing', 'Branding']
    const { data: services, isLoading: servicesLoading } = useServices(activeCategory)

    // We can filter for trending separately or just use the first few of the feed
    const trendingServices = services?.slice(0, 3) || []
    const topFreelancers: any[] = [] // Still mockup or separate query if needed


    return (
        <div className="flex flex-1 min-w-0">
            {/* Center content: Services Grid */}
            <div className="flex-1 min-w-0 border-r border-[#1a1a1a]">
                {/* Sticky Top Bar */}
                <div className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Services</h2>
                        <button className="bg-[#07da63] text-black font-bold px-5 py-1.5 rounded-full hover:bg-[#08f26e] transition-colors text-sm">
                            + List a Service
                        </button>
                    </div>
                    <div className="px-4 pb-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                            <input
                                type="text"
                                placeholder="Find services..."
                                className="w-full bg-[#16181c] border-none rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                            />
                        </div>
                    </div>
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all",
                                    activeCategory === cat
                                        ? "bg-[#07da63]/10 border-[#07da63] text-[#07da63]"
                                        : "border-[#1a1a1a] text-[#6b7280] hover:bg-white/5 hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a] bg-[#080808]">
                    <div className="flex gap-4 items-center">
                        <button className="flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                            <Filter size={14} /> Sort: Trending
                        </button>
                        <button className="flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={14} /> Recommended
                        </button>
                    </div>
                    <p className="text-[#6b7280] text-xs font-medium">428 services found</p>
                </div>

                <div className="p-4">
                    {servicesLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array(4).fill(0).map((_: any, idx: number) => <ServiceSkeleton key={idx} />)}
                        </div>
                    ) : services && services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {services.map((ts: any) => (
                                <ServiceCard
                                    key={ts.id}
                                    title={ts.title}
                                    provider={ts.users?.username || "Unknown"}
                                    price={ts.price_usdc}
                                    rating={ts.rating || 5.0}
                                    deliveryTime={ts.delivery_days || 7}
                                    image={ts.images?.[0]}
                                    avatar={ts.users?.profiles?.profile_image}
                                    isPremium={ts.users?.is_premium}
                                    onClick={() => setSelectedService(ts)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <Sparkles className="mx-auto mb-4 text-[#6b7280] opacity-20" size={60} />
                            <h3 className="text-white font-bold text-xl mb-2">No services found</h3>
                            <p className="text-[#6b7280] max-w-xs mx-auto">Either there are no services in this category, or none have been posted yet. Be the first to list a service!</p>
                            <button className="mt-8 bg-[#07da63] text-black font-bold px-8 py-3 rounded-full hover:bg-[#08f26e] transition-all">
                                List Your Service
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Content Panel */}
            <aside className="hidden xl:block w-[300px] shrink-0 h-screen sticky top-[60px] p-4 space-y-4">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Trending Services</h3>
                    <div className="space-y-4">
                        {trendingServices.slice(0, 4).map((ts: any) => (
                            <TrendingService key={ts.title} title={ts.title} price={`${ts.price_usdc} USDC`} />
                        ))}
                    </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Top Rated Freelancers</h3>
                    <div className="space-y-4">
                        {topFreelancers.length > 0 ? topFreelancers.map(tf => (
                            <FreelancerItem
                                key={tf.username}
                                name={tf.username}
                                handle={`@${tf.username}`}
                                rating="5.0"
                                img={tf.profiles?.profile_image || `https://i.pravatar.cc/150?u=${tf.username}`}
                            />
                        )) : (
                            <p className="text-xs text-[#6b7280] py-2">No ratings yet.</p>
                        )}
                    </div>
                </div>
            </aside>

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedService(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="w-full max-w-[900px] max-h-[90vh] bg-[#080808] border border-[#1a1a1a] rounded-3xl overflow-hidden relative z-[101] flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors text-white"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Column: Details */}
                            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                                <h2 className="text-3xl font-bold mb-6">{selectedService.title}</h2>

                                {/* Creator Header */}
                                <div className="flex items-center gap-4 mb-8 p-4 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a]">
                                    <img src={(selectedService.users as any)?.profiles?.profile_image || `https://i.pravatar.cc/150?u=${selectedService.users?.username}`} alt={selectedService.users?.username} className="w-14 h-14 rounded-full" />
                                    <div>
                                        <p className="font-bold text-lg flex items-center gap-1">
                                            {selectedService.users?.username || "Unknown Builder"} {selectedService.users?.is_premium && <CheckCircle2 size={16} className="text-[#07da63]" />}
                                        </p>
                                        <p className="text-[#6b7280] text-sm">Builder Score: {selectedService.users?.builder_score || 0}</p>
                                    </div>
                                    <button className="ml-auto bg-white text-black font-bold px-4 py-1.5 rounded-full text-xs">Follow</button>
                                </div>

                                {/* Gallery Placeholder */}
                                <div className="h-[300px] bg-[#111111] rounded-2xl mb-8 flex items-center justify-center border border-[#1a1a1a] overflow-hidden">
                                    <img
                                        src={selectedService.images?.[0] || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&u=${selectedService.title}`}
                                        className="w-full h-full object-cover opacity-60"
                                        alt="Service"
                                    />
                                </div>

                                {/* Tabs & Content */}
                                <div className="flex gap-6 border-b border-[#1a1a1a] mb-6">
                                    <button className="pb-3 border-b-2 border-[#07da63] text-white font-bold text-sm">Overview</button>
                                    <button className="pb-3 border-b-2 border-transparent text-[#6b7280] font-bold text-sm">FAQ</button>
                                    <button className="pb-3 border-b-2 border-transparent text-[#6b7280] font-bold text-sm">Reviews</button>
                                </div>

                                <div className="text-[15px] leading-relaxed text-[#6b7280] font-medium space-y-4">
                                    <p>{selectedService.description || "No description provided."}</p>
                                </div>
                            </div>

                            {/* Right Column: Pricing */}
                            <div className="w-full md:w-[350px] bg-[#0d0d0d] border-l border-[#1a1a1a] p-8 flex flex-col">
                                <div className="flex gap-2 mb-8 bg-black p-1 rounded-xl border border-[#1a1a1a]">
                                    <button className="flex-1 py-2 text-xs font-bold text-white bg-[#111111] rounded-lg border border-[#1a1a1a]">Basic</button>
                                    <button className="flex-1 py-2 text-xs font-bold text-[#6b7280] hover:text-white transition-colors">Standard</button>
                                    <button className="flex-1 py-2 text-xs font-bold text-[#6b7280] hover:text-white transition-colors">Premium</button>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold">Basic Package</h4>
                                        <span className="text-2xl font-bold text-[#07da63]">{selectedService.price_usdc} USDC</span>
                                    </div>
                                    <p className="text-xs text-[#6b7280] font-medium mb-6">Foundry Escrow Protected Service.</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <Clock size={16} className="text-[#07da63]" /> {selectedService.delivery_days} Days Delivery
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <Zap size={16} className="text-[#07da63]" /> Revision Included
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full bg-[#07da63] text-black font-bold py-4 rounded-xl hover:bg-[#08f26e] transition-colors flex items-center justify-center gap-2 group">
                                        Order Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <div className="bg-black/50 p-4 rounded-xl border border-[#1a1a1a] flex items-center gap-3">
                                        <ShieldCheck size={24} className="text-[#07da63]" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white">Escrow Protected</p>
                                            <p className="text-[10px] text-[#6b7280]">Foundry holds funds safely.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    )
}

function TrendingService({ title, price }: any) {
    return (
        <div className="group cursor-pointer">
            <p className="font-bold text-[15px] group-hover:underline">{title}</p>
            <p className="text-[#07da63] text-sm font-bold">{price}</p>
        </div>
    )
}

function FreelancerItem({ name, handle, rating, img }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <img src={img} alt={name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-[15px] group-hover:underline leading-tight">{name}</p>
                    <p className="text-[#6b7280] text-sm leading-tight">{handle}</p>
                </div>
            </div>
            <div className="text-right flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-sm font-bold">{rating}</span>
            </div>
        </div>
    )
}
