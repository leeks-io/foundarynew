'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    CheckCircle2, MapPin, Link as LinkIcon, Calendar,
    MessageSquare, UserPlus, Zap, MoreHorizontal,
    ShieldCheck, Star, Briefcase, Rocket, Sparkles, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts')

    return (
        <div className="flex flex-1 min-w-0">
            {/* Center Profile Content */}
            <div className="flex-1 min-w-0 border-r border-[#1a1a1a]">
                {/* Profile Header */}
                <div className="relative">
                    {/* Banner */}
                    <div className="h-[200px] bg-[#111111] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black opacity-50" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    {/* Avatar & Actions */}
                    <div className="px-4 pb-4">
                        <div className="flex justify-between items-start -mt-[60px] mb-4">
                            <div className="relative">
                                <div className="w-[120px] h-[120px] rounded-full bg-black border-4 border-black overflow-hidden relative group">
                                    <img
                                        src="https://i.pravatar.cc/150?u=david"
                                        alt="David Park"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 border-2 border-[#07da63] rounded-full pointer-events-none" />
                                </div>
                            </div>
                            <div className="pt-[70px] flex gap-2">
                                <button className="p-2 border border-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                                <button className="p-2 border border-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                                    <MessageSquare size={20} />
                                </button>
                                <button className="bg-white text-black font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity text-sm">
                                    Follow
                                </button>
                                <button className="bg-[#07da63] text-black font-bold px-5 py-2 rounded-full hover:bg-[#08f26e] transition-colors text-sm flex items-center gap-1">
                                    <Zap size={14} className="fill-current" /> Hire
                                </button>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h1 className="text-xl font-bold flex items-center gap-1.5">
                                David Park <CheckCircle2 size={18} className="text-[#07da63]" />
                                <span className="text-[10px] bg-[#07da63]/10 text-[#07da63] px-2 py-0.5 rounded border border-[#07da63]/20 font-bold uppercase tracking-widest flex items-center gap-1 glow-primary">
                                    <Sparkles size={10} /> Premium
                                </span>
                            </h1>
                            <p className="text-[#6b7280] text-[15px] mb-3">@davidbuilds</p>
                            <p className="text-[15px] leading-relaxed mb-4 max-w-xl">
                                Full-Stack Engineer & Web3 Builder. Building @foundrynetwork. prev: engineering at some-unicorn.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {['React', 'Solana', 'UI/UX', 'Node.js'].map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-transparent border border-[#07da63]/30 text-[#07da63] text-xs font-bold rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#6b7280] text-[15px]">
                                <span className="flex items-center gap-1"><MapPin size={16} /> San Francisco, CA</span>
                                <span className="flex items-center gap-1"><LinkIcon size={16} /> <a href="#" className="text-[#07da63] hover:underline">foundrynetwork.space</a></span>
                                <span className="flex items-center gap-1"><Calendar size={16} /> Joined March 2024</span>
                            </div>

                            <div className="flex gap-4 mt-3 text-[15px]">
                                <span className="hover:underline cursor-pointer"><strong className="text-white">234</strong> <span className="text-[#6b7280]">Following</span></span>
                                <span className="hover:underline cursor-pointer"><strong className="text-white">1.2k</strong> <span className="text-[#6b7280]">Followers</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Builder Score Card (X style integration) */}
                    <div className="px-4 mb-4">
                        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-[#6b7280] text-xs font-bold uppercase tracking-widest mb-1">Builder Score</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold text-[#07da63]">842</span>
                                        <span className="text-xs bg-[#07da63]/10 text-[#07da63] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Top 2%</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Services</p><p className="font-bold">48</p></div>
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Earned</p><p className="font-bold text-[#07da63]">9.4k</p></div>
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Projects</p><p className="font-bold">18</p></div>
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Rating</p><p className="font-bold">4.9★</p></div>
                                </div>
                            </div>
                            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <div className="h-full bg-[#07da63] w-[84%]" />
                            </div>
                        </div>
                    </div>

                    {/* Sticky Tabs */}
                    <div className="flex border-b border-[#1a1a1a] sticky top-[60px] z-20 bg-black/80 backdrop-blur-md">
                        {['Posts', 'Services', 'Portfolio', 'Startups', 'Reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className="flex-1 py-4 hover:bg-[#111111] transition-all relative group text-center"
                            >
                                <span className={cn("text-[15px] px-2", activeTab === tab.toLowerCase() ? "font-bold text-white" : "font-medium text-[#6b7280]")}>
                                    {tab}
                                </span>
                                {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#07da63] rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content (Feed style) */}
                <div className="divide-y divide-[#1a1a1a] pb-20">
                    <div className="p-10 text-center text-[#6b7280]">
                        <p className="mb-2 italic">Showing {activeTab}...</p>
                        <p className="text-sm">Real feed content would appear here based on selected tab.</p>
                    </div>
                </div>
            </div>

            {/* Right Content Panel */}
            <aside className="hidden lg:block w-[300px] shrink-0 h-screen sticky top-[60px] p-4 space-y-4">
                {/* On-Chain Reputation */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Reputation</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-[#07da63]" />
                            <div>
                                <p className="text-sm font-bold">Escrow Deals</p>
                                <p className="text-xl font-bold">31</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp size={20} className="text-[#07da63]" />
                            <div>
                                <p className="text-sm font-bold">Success Rate</p>
                                <p className="text-xl font-bold">98%</p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="px-3 py-1.5 bg-[#07da63]/10 text-[#07da63] text-xs font-bold rounded-lg border border-[#07da63]/20 flex items-center justify-center gap-2">
                                <CheckCircle2 size={12} /> Verified on Solana
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Services */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Active Services</h3>
                    <div className="space-y-4">
                        <div className="group cursor-pointer">
                            <p className="font-bold text-[15px] group-hover:underline">Full-Stack Landing Page</p>
                            <p className="text-[#07da63] text-sm font-bold">250 USDC</p>
                        </div>
                        <div className="group cursor-pointer">
                            <p className="font-bold text-[15px] group-hover:underline">Smart Contract Audit</p>
                            <p className="text-[#07da63] text-sm font-bold">800 USDC</p>
                        </div>
                    </div>
                </div>

                {/* Startups */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Startups</h3>
                    <div className="flex items-center gap-3 mb-4 group cursor-pointer">
                        <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#07da63]">
                            <Rocket size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[15px] group-hover:underline">AI Resume Tool</p>
                            <p className="text-[#6b7280] text-xs">SaaS · MVP</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
