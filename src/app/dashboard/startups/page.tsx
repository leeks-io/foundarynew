'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Rocket, Lightbulb, Users, Plus, ChevronRight,
    Lock, ArrowRight, TrendingUp, MessageSquare,
    Zap, CheckCircle2, DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'
import StartupCard from '@/components/marketplace/StartupCard'
import { useAuth } from '@/hooks/useAuth'
import { useStartups } from '@/hooks/useStartups'
import { useBlueprints } from '@/hooks/useBlueprints'
import { useBuilders } from '@/hooks/useBuilders'
import { createStartup } from '@/lib/queries/startups'
import { createClient } from '@/lib/supabase/client'

import Link from 'next/link'

export default function StartupHub() {
    const [activeTab, setActiveTab] = useState('marketplace')
    const { user: currentUser } = useAuth()
    const { data: startups, isLoading: startupsLoading } = useStartups()
    const { data: blueprints, isLoading: blueprintsLoading } = useBlueprints()
    const { data: cofounders, isLoading: buildersLoading } = useBuilders()

    // Form states
    const [startupName, setStartupName] = useState('')
    const [tagline, setTagline] = useState('')
    const [description, setDescription] = useState('')
    const [industry, setIndustry] = useState('')
    const [stage, setStage] = useState('Idea')
    const [isPosting, setIsPosting] = useState(false)

    const isPremium = currentUser?.is_premium || false
    const supabase = createClient()

    const handlePostStartup = async () => {
        if (!startupName || !currentUser) return
        setIsPosting(true)

        try {
            await createStartup(currentUser.id, {
                name: startupName,
                tagline,
                description,
                industry,
                stage,
                metrics: { users: 0, revenue: 0 },
                price_usdc: 0
            })
            alert("Startup posted successfully!")
            setActiveTab('marketplace')
            // React Query will re-fetch if we invalidate or just rely on its cache logic
        } catch (error: any) {
            alert("Error posting startup: " + error.message)
        } finally {
            setIsPosting(false)
        }
    }

    const tabs = [
        { id: 'marketplace', label: 'Startups For Sale' },
        { id: 'post', label: 'Post Your Startup' },
        { id: 'cofounders', label: 'Find Cofounders' },
        { id: 'blueprints', label: 'Blueprints' },
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
                                        {startups && startups.length > 0 ? (
                                            startups.slice(0, 3).map((s: any) => <StartupCard key={s.name} {...s} />)
                                        ) : (
                                            <div className="col-span-3 h-40 bg-white/5 rounded-3xl" />
                                        )}
                                    </div>
                                </div>
                            )}

                            {isPremium && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {startupsLoading ? (
                                        <div className="col-span-3 py-20 text-center text-[#6b7280]">Loading marketplace...</div>
                                    ) : startups && startups.length > 0 ? (
                                        startups.map((startup: any, idx: number) => (
                                            <StartupCard
                                                key={startup.id || idx}
                                                name={startup.name}
                                                revenue={startup.metrics?.revenue || 0}
                                                users={startup.metrics?.users || 0}
                                                price={startup.price_usdc}
                                                industry={startup.industry}
                                                logo={startup.logo_url}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-3 py-20 text-center">
                                            <Rocket className="mx-auto mb-4 text-[#6b7280] opacity-20" size={60} />
                                            <h3 className="text-white font-bold text-xl mb-2">Marketplace is empty</h3>
                                            <p className="text-[#6b7280] max-w-xs mx-auto">No startups are currently listed for sale. Be the first to list yours!</p>
                                        </div>
                                    )}
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
                                        <input
                                            type="text"
                                            value={startupName}
                                            onChange={(e) => setStartupName(e.target.value)}
                                            placeholder="e.g. Foundry Network"
                                            className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Tagline</label>
                                        <input
                                            type="text"
                                            value={tagline}
                                            onChange={(e) => setTagline(e.target.value)}
                                            placeholder="A brief one-liner about your startup"
                                            className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Tell us about the problem you're solving..."
                                            className="w-full h-32 bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Industry</label>
                                            <select
                                                value={industry}
                                                onChange={(e) => setIndustry(e.target.value)}
                                                className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-[#6b7280] focus:border-[#07da63] focus:outline-none appearance-none"
                                            >
                                                <option value="">Select Industry</option>
                                                <option value="SaaS">SaaS</option>
                                                <option value="Web3">Web3</option>
                                                <option value="AI">AI</option>
                                                <option value="DevTools">DevTools</option>
                                                <option value="Marketing">Marketing</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1">Stage</label>
                                            <div className="flex gap-2 bg-black p-1 rounded-xl border border-[#1a1a1a]">
                                                {['Idea', 'MVP', 'Revenue'].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setStage(s)}
                                                        className={cn(
                                                            "flex-1 py-2 text-[10px] font-bold transition-colors rounded-lg",
                                                            stage === s ? "bg-[#111111] text-white border border-[#1a1a1a]" : "text-[#6b7280] hover:text-white"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        disabled={isPosting}
                                        onClick={handlePostStartup}
                                        className="w-full bg-[#07da63] text-black font-bold h-14 rounded-xl mt-8 hover:bg-[#08f26e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isPosting ? 'Posting...' : 'Post Startup'} <Zap size={20} className="fill-current" />
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
                            {blueprints.length > 0 ? blueprints.map((bp: any) => (
                                <div key={bp.id} className="bg-[#0d0d0d] border border-[#1a1a1a] border-l-4 border-l-[#07da63] p-8 rounded-r-[2.5rem] group hover:bg-[#111111] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">{bp.title}</h3>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-black border border-[#1a1a1a] rounded-lg text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">{bp.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-[#6b7280] uppercase tracking-widest block mb-1">Price</span>
                                            <span className="text-2xl font-bold text-[#07da63]">{bp.price_usdc} USDC</span>
                                        </div>
                                    </div>
                                    <p className="text-[#6b7280] font-medium mb-8 max-w-2xl">
                                        {bp.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280]">
                                                <Users size={16} /> {bp.metrics?.interested || 0} interested
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280]">
                                                <Rocket size={16} /> {bp.metrics?.builders || 0} building
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="bg-[#07da63] text-black font-bold px-6 py-2 rounded-lg text-sm">Join Build</button>
                                            <button className="border border-[#1a1a1a] text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-white/5 transition-all">Buy Idea</button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-[#6b7280]">No blueprints found.</div>
                            )}
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
                            {cofounders.length > 0 ? (
                                cofounders.map((cf: any) => (
                                    <div key={cf.username} className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-[2rem] group hover:border-[#07da63]/30 transition-all">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-20 h-20 rounded-full border-2 border-[#1a1a1a] p-1 mb-4 group-hover:border-[#07da63] transition-all">
                                                <img src={(cf.profiles as any)?.profile_image || `https://i.pravatar.cc/150?u=${cf.username}`} className="w-full h-full rounded-full object-cover" alt="Profile" />
                                            </div>
                                            <h3 className="font-bold text-lg flex items-center gap-1.5">
                                                {cf.username} <CheckCircle2 size={16} className="text-[#07da63]" />
                                            </h3>
                                            <p className="text-[#6b7280] text-sm font-medium mb-6">{cf.role}</p>
                                            <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
                                                {cf.skills?.slice(0, 3).map((s: string) => (
                                                    <span key={s} className="px-2 py-0.5 bg-black border border-[#1a1a1a] rounded text-[10px] font-bold text-[#6b7280]">{s}</span>
                                                ))}
                                            </div>
                                            <Link href={`/dashboard/builder/${cf.username}`} className="w-full bg-[#07da63] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-[#08f26e] transition-colors text-center">
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 py-20 text-center text-[#6b7280]">No builders found yet.</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
