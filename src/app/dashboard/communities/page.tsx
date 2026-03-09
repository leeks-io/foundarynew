'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Search, Plus, Radio, Lock, ChevronRight,
    MessageSquare, Star, Zap, Globe, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function CommunitiesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'Web3', 'AI Builders', 'Design', 'Founders', 'DeFi', 'Gaming']

    return (
        <div className="flex flex-1 min-w-0">
            {/* Center: Community Discovery */}
            <div className="flex-1 min-w-0 border-r border-[#1a1a1a]">
                {/* Sticky Top Bar */}
                <div className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Communities</h2>
                        <button className="bg-[#07da63] text-black font-bold px-5 py-1.5 rounded-full hover:bg-[#08f26e] transition-colors text-sm">
                            + Create
                        </button>
                    </div>
                    <div className="px-4 pb-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                            <input
                                type="text"
                                placeholder="Search communities..."
                                className="w-full bg-[#16181c] border-none rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Featured Communities (X style cards) */}
                <div className="p-4 border-b border-[#1a1a1a]">
                    <h3 className="text-sm font-bold text-[#6b7280] uppercase tracking-widest mb-4 px-2">Featured</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        <CommunityCard name="Solana Builders" members="4.2k" tag="Web3" />
                        <CommunityCard name="AI Agents Lab" members="2.8k" tag="AI" />
                        <CommunityCard name="Design Foundry" members="1.5k" tag="Design" />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-[#1a1a1a] no-scrollbar">
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

                {/* Community List */}
                <div className="divide-y divide-[#1a1a1a]">
                    <LiveSpaceCard topic="How I raised $100k in 30 days" host="Sarah Chen" listeners="245" />

                    <CommunityListItem
                        name="Frontend Masters"
                        desc="Discussing the latest in React, Next.js, and Tailwind."
                        members="8.4k"
                        isJoined
                    />
                    <CommunityListItem
                        name="Founders Circle"
                        desc="Private space for verified startup founders."
                        members="420"
                        isPrivate
                    />
                    <CommunityListItem
                        name="Rust Nomads"
                        desc="Low-level systems and high-level performance."
                        members="1.2k"
                    />
                </div>
            </div>

            {/* Right: Panels */}
            <aside className="hidden xl:block w-[300px] shrink-0 h-screen sticky top-[60px] p-4 space-y-4">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Suggested for You</h3>
                    <div className="space-y-4">
                        <SuggestedItem name="DeFi Architects" members="920" />
                        <SuggestedItem name="Next.js Hub" members="15k" />
                    </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Your Communities</h3>
                    <div className="space-y-4">
                        <YourCommunityItem name="Solana Builders" unread={3} />
                        <YourCommunityItem name="AI Agents Lab" />
                    </div>
                </div>
            </aside>
        </div>
    )
}

function CommunityCard({ name, members, tag }: any) {
    return (
        <div className="min-w-[240px] bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 group hover:border-[#07da63]/30 transition-all cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#07da63]/5 blur-[30px] -mr-12 -mt-12 pointer-events-none" />
            <div className="w-12 h-12 bg-[#111111] rounded-xl border border-[#1a1a1a] flex items-center justify-center text-[#07da63] mb-4">
                <Globe size={24} />
            </div>
            <h4 className="font-bold text-lg mb-1">{name}</h4>
            <p className="text-[#6b7280] text-xs font-bold mb-6">{members} members · {tag}</p>
            <button className="w-full py-2 border border-[#1a1a1a] text-white rounded-full font-bold text-xs hover:bg-white/5 transition-all">
                Join
            </button>
        </div>
    )
}

function CommunityListItem({ name, desc, members, isJoined, isPrivate }: any) {
    return (
        <div className="p-4 hover:bg-[#080808] transition-colors cursor-pointer flex gap-4 items-start relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#1a1a1a] flex items-center justify-center text-[#6b7280] group-hover:text-[#07da63] transition-colors">
                {isPrivate ? <Lock size={20} /> : <Users size={20} />}
            </div>
            <div className="flex-1 pr-12">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[15px]">{name}</h4>
                    <span className="text-[#6b7280] text-xs">· {members} members</span>
                </div>
                <p className="text-[#6b7280] text-sm font-medium line-clamp-1">{desc}</p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isJoined ? (
                    <span className="text-[#07da63] text-xs font-bold px-3 py-1 bg-[#07da63]/10 rounded-full border border-[#07da63]/20 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Joined
                    </span>
                ) : (
                    <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-xs hover:opacity-90 transition-opacity">
                        {isPrivate ? 'Request' : 'Join'}
                    </button>
                )}
            </div>
        </div>
    )
}

function LiveSpaceCard({ topic, host, listeners }: any) {
    return (
        <div className="p-4 border-l-4 border-l-red-500 bg-red-500/[0.03] hover:bg-red-500/[0.05] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Space</span>
            </div>
            <h4 className="text-lg font-bold mb-3">{topic}</h4>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${host}`} className="w-full h-full object-cover" alt="Host" />
                    </div>
                    <span className="text-xs text-[#6b7280] font-bold">Hosted by {host}</span>
                    <span className="text-xs text-[#6b7280] ml-2">· {listeners} listening</span>
                </div>
                <button className="bg-[#07da63] text-black font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-2">
                    <Radio size={14} className="animate-pulse" /> Join Space
                </button>
            </div>
        </div>
    )
}

function SuggestedItem({ name, members }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-[#6b7280]">
                    <Users size={16} />
                </div>
                <div>
                    <p className="font-bold text-sm group-hover:underline leading-tight">{name}</p>
                    <p className="text-[#6b7280] text-xs leading-tight">{members} members</p>
                </div>
            </div>
            <button className="bg-white text-black font-bold px-3 py-1 rounded-full text-[10px] hover:opacity-90 transition-opacity">
                Join
            </button>
        </div>
    )
}

function YourCommunityItem({ name, unread }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-[#07da63]">
                    <Globe size={16} />
                </div>
                <p className={cn("text-sm group-hover:underline leading-tight", unread ? "font-bold text-white" : "font-medium text-[#6b7280]")}>
                    {name}
                </p>
            </div>
            {unread && (
                <div className="w-5 h-5 bg-[#07da63] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread}
                </div>
            )}
        </div>
    )
}
