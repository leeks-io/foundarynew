'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, ShoppingCart, Users, ArrowRight, Zap, Target, Search } from 'lucide-react'
import { useBlueprints } from '@/hooks/useBlueprints'
import { cn } from '@/lib/utils'

export default function BlueprintsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const { data: blueprints, isLoading: loading } = useBlueprints()

    return (
        <div className="flex-1 min-h-screen bg-black border-x border-[#1a1a1a] max-w-[600px]">
            {/* Header */}
            <header className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a] p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="text-[#07da63]" size={24} />
                    <h1 className="text-2xl font-bold">Blueprint Marketplace</h1>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                    <input
                        type="text"
                        placeholder="Search build-plans and ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#16181c] border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                    />
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-1 gap-6 pb-20">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-[#0d0d0d] animate-pulse rounded-2xl" />
                        ))
                    ) : blueprints && blueprints.length > 0 ? (
                        blueprints.map((blueprint: any) => (
                            <motion.div
                                key={blueprint.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0d0d0d] border border-[#1a1a1a] border-l-4 border-l-[#07da63] p-6 rounded-r-2xl hover:border-l-[#08f26e] transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-[#07da63]">
                                            <Zap size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Build Plan</span>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-[#07da63] transition-colors">{blueprint.title}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#07da63] font-bold text-lg">{blueprint.price_usdc > 0 ? `${blueprint.price_usdc} USDC` : "FREE"}</p>
                                        <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider">Asking Price</p>
                                    </div>
                                </div>

                                <p className="text-[#6b7280] text-[15px] mb-6 line-clamp-2">{blueprint.description}</p>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] rounded text-[11px] font-bold text-white border border-white/5">
                                        <Target size={12} className="text-[#07da63]" />
                                        {blueprint.industry || "General"}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] rounded text-[11px] font-bold text-white border border-white/5">
                                        <Users size={12} className="text-[#07da63]" />
                                        {blueprint.metrics?.interested || 0} Interested
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button className="flex-1 bg-[#07da63] text-black font-bold py-2.5 rounded-xl hover:bg-[#08f26e] transition-all flex items-center justify-center gap-2">
                                        <ShoppingCart size={16} />
                                        Buy Blueprint
                                    </button>
                                    <button className="px-5 border border-[#1a1a1a] text-white font-bold py-2.5 rounded-xl hover:bg-white/5 transition-all">
                                        Discuss
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-[#0d0d0d] rounded-3xl border border-dashed border-[#1a1a1a]">
                            <Lightbulb size={48} className="text-[#6b7280] mx-auto mb-4 opacity-20" />
                            <h3 className="text-white font-bold mb-2">No Blueprints found</h3>
                            <p className="text-[#6b7280] text-sm max-w-[250px] mx-auto">Be the first to list a build-plan and earn from your startup ideas.</p>
                            <button className="mt-8 bg-[#07da63] text-black font-bold px-6 py-2 rounded-full hover:bg-[#08f26e] transition-colors">
                                Post Your Idea
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
