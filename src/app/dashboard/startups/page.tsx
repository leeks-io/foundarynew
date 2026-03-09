'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Rocket, Lightbulb, Users, Plus, ChevronRight,
    Lock, ArrowRight, TrendingUp, MessageSquare,
    Zap, CheckCircle2, DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'
import StartupCard from '@/components/marketplace/StartupCard'
import Link from 'next/link'

export default function StartupHub() {
    const [activeTab, setActiveTab] = useState('marketplace')
    const [isPremium, setIsPremium] = useState(false) // Toggle for demo

    const tabs = [
        { id: 'marketplace', label: 'Startups For Sale' },
        { id: 'post', label: 'Post Your Startup' },
        { id: 'cofounders', label: 'Find Cofounders' },
        { id: 'blueprints', label: 'Blueprints' },
    ]

    const startups = [
        { name: "AI Resume Builder", revenue: 4200, users: 8500, price: 45000, industry: "AI · SaaS" },
        { name: "SaaS Dev Tools", revenue: 12500, users: 3200, price: 185000, industry: "DevTools" },
        { name: "Social Media Scheduler", revenue: 1200, users: 450, price: 15000, industry: "Marketing" },
    ]

    return (
        <div className="flex flex-col flex-1 min-w-0">
            {/* Sticky Top Bar */}
            <div className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
                <div className="px-4 py-3">
                    <h2 className="text-xl font-bold">Startup Hub</h2>
                </div>
                <div className="flex overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 py-4 hover:bg-[#111111] transition-all relative group min-w-[140px]"
                        >
                            <span className={cn("text-[14px] px-2 whitespace-nowrap", activeTab === tab.id ? "font-bold text-white" : "font-medium text-[#6b7280]")}>
                                {tab.label}
                            </span>
                            {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#07da63] rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'marketplace' && (
                        <motion.div
                            key="marketplace"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {!isPremium && (
                                <div className="relative rounded-[2.5rem] overflow-hidden border border-[#07da63]/30 bg-[#0d0d0d] p-12 text-center group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#07da63]/5 to-transparent pointer-events-none" />
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-[72px] h-[72px] bg-[#07da63]/10 rounded-2xl flex items-center justify-center text-[#07da63] mb-6 animate-float">
                                            <Lock size={32} />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">Startup Marketplace is a Premium feature</h2>
                                        <p className="text-[#6b7280] max-w-lg mx-auto mb-8 font-medium">
                                            Get exclusive access to verified pre-revenue and profitable startups. View full metrics, P&L statements, and contact founders directly.
                                        </p>
                                        <Link href="/dashboard/premium" className="bg-[#07da63] text-black font-bold px-10 py-4 rounded-xl hover:bg-[#08f26e] transition-all flex items-center gap-2 shadow-[0_0_20px_#07da6340]">
                                            Unlock for $5 USDC <ArrowRight size={20} />
                                        </Link>
                                    </div>

                                    {/* Blurred content background for effect */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 opacity-20 filter blur-sm grayscale pointer-events-none select-none">
                                        {startups.map(s => <StartupCard key={s.name} {...s} />)}
                                    </div>
                                </div>
                            )}

                            {isPremium && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {startups.map(startup => (
                                        <StartupCard key={startup.name} {...startup} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'post' && (
                        <motion.div
                            key="post"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[2.5rem] p-8 md:p-12">
                                <h2 className="text-2xl font-bold mb-8">Post your Startup</h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Startup Name</label>
                                        <input type="text" placeholder="e.g. Foundry Network" className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Tagline</label>
                                        <input type="text" placeholder="A brief one-liner about your startup" className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Description</label>
                                        <textarea placeholder="Tell us about the problem you're solving..." className="w-full h-32 bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none resize-none" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Industry</label>
                                            <select className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-[#6b7280] focus:border-[#07da63] focus:outline-none appearance-none">
                                                <option>Select Industry</option>
                                                <option>SaaS</option>
                                                <option>Web3</option>
                                                <option>AI</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Stage</label>
                                            <div className="flex gap-2 bg-black p-1 rounded-xl border border-[#1a1a1a]">
                                                {['Idea', 'MVP', 'Revenue'].map(s => (
                                                    <button key={s} className="flex-1 py-2 text-[10px] font-bold text-[#6b7280] hover:text-white transition-colors">{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Looking for:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Cofounder', 'Developer', 'Designer', 'Marketer', 'Investor'].map(chip => (
                                                <button key={chip} className="px-4 py-1.5 border border-[#1a1a1a] rounded-full text-xs font-bold text-[#6b7280] hover:border-[#07da63]/50 hover:text-white transition-all">
                                                    {chip}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="w-full bg-[#07da63] text-black font-bold h-14 rounded-xl mt-8 hover:bg-[#08f26e] transition-colors flex items-center justify-center gap-2">
                                        Post Startup <Zap size={20} className="fill-current" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'blueprints' && (
                        <motion.div
                            key="blueprints"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] border-l-4 border-l-[#07da63] p-8 rounded-r-[2.5rem] group hover:bg-[#111111] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">AI tool that summarizes WhatsApp voice notes</h3>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-black border border-[#1a1a1a] rounded-lg text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">AI</span>
                                                <span className="px-3 py-1 bg-black border border-[#1a1a1a] rounded-lg text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">SaaS</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-[#6b7280] uppercase tracking-widest block mb-1">Price</span>
                                            <span className="text-2xl font-bold text-[#07da63]">50 USDC</span>
                                        </div>
                                    </div>
                                    <p className="text-[#6b7280] font-medium mb-8 max-w-2xl">
                                        A chrome extension that uses Whisper API to transcribe and summarize voice notes directly in the WhatsApp Web interface. Solves the pain of long voice messages.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280]">
                                                <Users size={16} /> 24 interested
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280]">
                                                <Rocket size={16} /> 8 building
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280]">
                                                <MessageSquare size={16} /> 12 discussions
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="bg-[#07da63] text-black font-bold px-6 py-2 rounded-lg text-sm">Join Build</button>
                                            <button className="border border-[#1a1a1a] text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-white/5 transition-all">Buy Idea</button>
                                            <button className="border border-[#1a1a1a] text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-white/5 transition-all">Discuss</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'cofounders' && (
                        <motion.div
                            key="cofounders"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-[2rem] group hover:border-[#07da63]/30 transition-all">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-full border-2 border-[#1a1a1a] p-1 mb-4 group-hover:border-[#07da63] transition-all">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full rounded-full object-cover" alt="Profile" />
                                        </div>
                                        <h3 className="font-bold text-lg flex items-center gap-1.5">
                                            David Park <CheckCircle2 size={16} className="text-[#07da63]" />
                                        </h3>
                                        <p className="text-[#6b7280] text-sm font-medium mb-6">Full-Stack Engineer</p>
                                        <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
                                            {['Solana', 'React', 'Rust'].map(s => (
                                                <span key={s} className="px-2 py-0.5 bg-black border border-[#1a1a1a] rounded text-[10px] font-bold text-[#6b7280]">{s}</span>
                                            ))}
                                        </div>
                                        <button className="w-full bg-[#07da63] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-[#08f26e] transition-colors">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
