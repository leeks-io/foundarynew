'use client'

import { useRole } from '@/context/RoleContext'
import StartupCard from '@/components/marketplace/StartupCard'
import { Plus, Lightbulb, MessageSquare, TrendingUp } from 'lucide-react'

export default function StartupHub() {
    const { role } = useRole()

    const startups = [
        { name: "AI Resume Builder", revenue: 4200, users: 8500, price: 45000 },
        { name: "SaaS Dev Tools", revenue: 12500, users: 3200, price: 185000 },
        { name: "Web3 Ad Network", revenue: 800, users: 450, price: 12000 },
    ]

    const blueprints = [
        { title: "AI Voice Note Summarizer", category: "Micro-SaaS", price: 50, interest: 12 },
        { title: "Decentralized Payroll for DAO", category: "Web3", price: 450, interest: 8 },
    ]

    return (
        <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-3 italic uppercase tracking-tighter">Startup Hub</h1>
                    <p className="text-white/40 text-lg">Build teams, launch projects, and trade digital assets.</p>
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 text-sm uppercase italic tracking-wider">
                        <Plus className="w-4 h-4" />
                        New Startup
                    </button>
                    <button className="px-6 py-4 bg-primary text-white rounded-2xl font-black italic uppercase tracking-widest glow-primary hover:scale-[1.02] transition-all active:scale-95 shadow-2xl text-sm">
                        Post Blueprint
                    </button>
                </div>
            </div>

            {/* Startup Marketplace Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 italic uppercase tracking-tight">Active Listings</h2>
                        <p className="text-sm text-white/40">Verified startups currently for sale on the network.</p>
                    </div>
                    <button className="text-primary text-sm font-bold hover:underline">View All Listings</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {startups.map((startup) => (
                        <StartupCard key={startup.name} {...startup} />
                    ))}
                </div>
            </section>

            {/* Blueprints Section - Viral Feature #1 */}
            <section className="glass rounded-[3rem] p-12 border border-white/5 bg-accent/5">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-widest mb-4">
                            Viral Feature
                        </div>
                        <h2 className="text-4xl font-black mb-3 italic uppercase tracking-tighter">Blueprint Marketplace</h2>
                        <p className="text-white/40 max-w-xl">
                            Post startup ideas, find co-founders, or sell high-potential blueprints to developers looking for their next build.
                        </p>
                    </div>
                    <Lightbulb className="w-16 h-16 text-accent animate-pulse opacity-20 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blueprints.map((blueprint) => (
                        <div key={blueprint.title} className="glass p-8 rounded-3xl border border-white/5 hover:border-accent/50 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-6 h-6 text-accent" />
                            </div>

                            <div className="text-[10px] font-bold text-accent uppercase mb-4 tracking-widest">{blueprint.category}</div>
                            <h3 className="text-2xl font-bold mb-6 group-hover:text-accent transition-colors">{blueprint.title}</h3>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase">
                                        <TrendingUp className="w-3 h-3" />
                                        {blueprint.interest} Interested
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase">
                                        <MessageSquare className="w-3 h-3" />
                                        4 Discussions
                                    </div>
                                </div>
                                <div className="text-xl font-black text-white">
                                    {blueprint.price} <span className="text-[10px] text-white/40">USDC</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

import { ArrowUpRight } from 'lucide-react'
