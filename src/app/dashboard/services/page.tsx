'use client'

import { useRole } from '@/context/RoleContext'
import ServiceCard from '@/components/marketplace/ServiceCard'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'

export default function ServicesMarketplace() {
    const { role } = useRole()

    const services = [
        { title: "High-end Web3 Landing Page Design", provider: "Rivera Studio", price: 450, rating: 5.0, deliveryTime: 7 },
        { title: "ERC-721 Smart Contract Audit", provider: "Thorne Security", price: 1200, rating: 4.9, deliveryTime: 3 },
        { title: "Custom AI Agent Integration", provider: "Nexus AI", price: 800, rating: 5.0, deliveryTime: 5 },
        { title: "Viral Twitter Thread Ghostwriting", provider: "ContentGenix", price: 150, rating: 4.8, deliveryTime: 2 },
        { title: "Pitch Deck for VC Fundraising", provider: "StoryFoundry", price: 600, rating: 5.0, deliveryTime: 4 },
        { title: "Next.js Performance Optimization", provider: "TurboDev", price: 300, rating: 4.9, deliveryTime: 3 },
    ]

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-3 italic uppercase tracking-tighter">Services Marketplace</h1>
                    <p className="text-white/40 text-lg">The world's first escrow-protected marketplace for digital services.</p>
                </div>

                {role === 'freelancer' && (
                    <button className="px-8 py-4 bg-accent text-[#0B0F19] rounded-2xl font-black italic uppercase tracking-widest glow-accent hover:scale-[1.02] transition-all active:scale-95 shadow-2xl">
                        List a Service
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="glass p-2 rounded-2xl border border-white/5 flex flex-1 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="What service are you looking for today?"
                            className="w-full bg-transparent border-none py-3 pl-11 pr-4 font-medium outline-none text-sm"
                        />
                    </div>
                    <button className="px-6 py-2 bg-primary rounded-xl font-bold text-xs hover:bg-primary/90 transition-all">
                        Find Services
                    </button>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none px-6 py-4 glass border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-white/5">
                        <SlidersHorizontal className="w-4 h-4" />
                        Category
                    </button>
                    <button className="flex-1 lg:flex-none px-6 py-4 glass border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-white/5">
                        <Sparkles className="w-4 h-4" />
                        Sort By
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <ServiceCard key={service.title} {...service} />
                ))}
            </div>
        </div>
    )
}
