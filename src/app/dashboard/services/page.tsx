'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, SlidersHorizontal, Sparkles, Filter,
    Star, Clock, ShieldCheck, X, ArrowRight, Zap, CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ServiceCard from '@/components/marketplace/ServiceCard'
import Link from 'next/link'

export default function ServicesPage() {
    const [selectedService, setSelectedService] = useState<any>(null)
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'UI/UX Design', 'Web Dev', 'Smart Contracts', 'AI Tools', 'Marketing', 'Branding']

    const services = [
        { id: 1, title: "High-end Web3 Landing Page Design", provider: "Rivera Studio", price: 450, rating: 5.0, deliveryTime: 7, isPremium: true },
        { id: 2, title: "ERC-721 Smart Contract Audit", provider: "Thorne Security", price: 1200, rating: 4.9, deliveryTime: 3, isPremium: true },
        { id: 3, title: "Custom AI Agent Integration", provider: "Nexus AI", price: 800, rating: 5.0, deliveryTime: 5, isPremium: false },
        { id: 4, title: "Viral Twitter Thread Ghostwriting", provider: "ContentGenix", price: 150, rating: 4.8, deliveryTime: 2, isPremium: false },
        { id: 5, title: "Pitch Deck for VC Fundraising", provider: "StoryFoundry", price: 600, rating: 5.0, deliveryTime: 4, isPremium: true },
        { id: 6, title: "Next.js Performance Optimization", provider: "TurboDev", price: 300, rating: 4.9, deliveryTime: 3, isPremium: false },
    ]

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

                {/* Services Grid */}
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {services.map(service => (
                            <ServiceCard
                                key={service.id}
                                {...service}
                                onClick={() => setSelectedService(service)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Content Panel */}
            <aside className="hidden xl:block w-[300px] shrink-0 h-screen sticky top-[60px] p-4 space-y-4">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Trending Services</h3>
                    <div className="space-y-4">
                        <TrendingService title="AI Chatbot Integration" price="400 USDC" />
                        <TrendingService title="Solana NFT Mint Page" price="600 USDC" />
                        <TrendingService title="Viral Content Strategy" price="200 USDC" />
                    </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Top Rated Freelancers</h3>
                    <div className="space-y-4">
                        <FreelancerItem name="Elena V." handle="@elena" rating="5.0" img="https://i.pravatar.cc/150?img=44" />
                        <FreelancerItem name="Marcus T." handle="@marcus" rating="4.9" img="https://i.pravatar.cc/150?img=12" />
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
                                    <img src={`https://i.pravatar.cc/150?u=${selectedService.provider}`} alt={selectedService.provider} className="w-14 h-14 rounded-full" />
                                    <div>
                                        <p className="font-bold text-lg flex items-center gap-1">
                                            {selectedService.provider} {selectedService.isPremium && <CheckCircle2 size={16} className="text-[#07da63]" />}
                                        </p>
                                        <p className="text-[#6b7280] text-sm">Builder Score: 842 · Rank #12</p>
                                    </div>
                                    <button className="ml-auto bg-white text-black font-bold px-4 py-1.5 rounded-full text-xs">Follow</button>
                                </div>

                                {/* Gallery Placeholder */}
                                <div className="h-[300px] bg-[#111111] rounded-2xl mb-8 flex items-center justify-center border border-[#1a1a1a] overflow-hidden">
                                    <img
                                        src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&u=${selectedService.title}`}
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
                                    <p>I will provide professional Web3 landing page design services tailored for your dApp or NFT collection.</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Custom layout design in Figma</li>
                                        <li>Responsive across all devices</li>
                                        <li>Dark mode & high-end aesthetics</li>
                                        <li>Source file delivery</li>
                                    </ul>
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
                                        <span className="text-2xl font-bold text-[#07da63]">{selectedService.price} USDC</span>
                                    </div>
                                    <p className="text-xs text-[#6b7280] font-medium mb-6">Single page landing design with mobile optimization.</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <Clock size={16} className="text-[#07da63]" /> {selectedService.deliveryTime} Days Delivery
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <Zap size={16} className="text-[#07da63]" /> 3 Revisions
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
        </div>
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
