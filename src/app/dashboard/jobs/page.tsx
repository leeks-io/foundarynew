'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Briefcase, MapPin, DollarSign, Calendar,
    ArrowUpRight, Bookmark, CheckCircle2, AlertTriangle,
    Users, Rocket, Sparkles, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function JobsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('All')
    const [showLimitModal, setShowLimitModal] = useState(false)
    const [applicationCount, setApplicationCount] = useState(0)

    const filters = ['All', 'Remote', 'Full-time', 'Part-time', 'Contract', 'Web3', 'AI', 'Design', 'Dev']

    const jobs = [
        { id: 1, title: 'Lead Frontend Engineer', company: 'Nexus AI', handle: '@nexus', type: 'Full-time', budget: '120k+', location: 'Remote', time: '2h', logo: 'N' },
        { id: 2, title: 'Smart Contract Auditor', company: 'EtherGuard', handle: '@etherguard', type: 'Contract', budget: '5,000 USDC', location: 'Remote', time: '4h', logo: 'E' },
        { id: 3, title: 'Growth Marketer', company: 'Foundry Labs', handle: '@foundry', type: 'Full-time', budget: '80k+', location: 'Hybrid', time: '6h', logo: '⬡' },
    ]

    const handleApply = () => {
        if (applicationCount >= 2) {
            setShowLimitModal(true)
        } else {
            setApplicationCount(prev => prev + 1)
            // Actual apply logic here
        }
    }

    return (
        <div className="flex flex-1 min-w-0">
            {/* Left: Job Listings Feed (65%) */}
            <div className="flex-[0.65] min-w-0 border-r border-[#1a1a1a]">
                {/* Sticky Top Bar */}
                <div className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Jobs</h2>
                        <button className="bg-[#07da63] text-black font-bold px-5 py-1.5 rounded-full hover:bg-[#08f26e] transition-colors text-sm">
                            + Post a Job
                        </button>
                    </div>
                    <div className="px-4 pb-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                            <input
                                type="text"
                                placeholder="Search jobs, skills..."
                                className="w-full bg-[#16181c] border-none rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all",
                                    activeFilter === filter
                                        ? "bg-[#07da63]/10 border-[#07da63] text-[#07da63]"
                                        : "border-[#1a1a1a] text-[#6b7280] hover:bg-white/5 hover:text-white"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Listings */}
                <div className="divide-y divide-[#1a1a1a]">
                    {jobs.map(job => (
                        <div key={job.id} className="p-5 hover:bg-[#080808] transition-colors group cursor-pointer flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#1a1a1a] flex items-center justify-center font-bold text-xl text-[#07da63] shrink-0">
                                {job.logo}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:underline">{job.title}</h3>
                                        <p className="text-[#6b7280] text-sm font-medium">{job.company} {job.handle}</p>
                                    </div>
                                    <button className="text-[#6b7280] hover:text-[#07da63] transition-colors p-2 rounded-full hover:bg-[#07da63]/10">
                                        <Bookmark size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 my-3 text-[#6b7280] text-xs font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1"><MapPin size={12} /> {job.location}</div>
                                    <div className="flex items-center gap-1"><Rocket size={12} /> {job.type}</div>
                                    <div className="flex items-center gap-1"><Calendar size={12} /> Posted {job.time} ago</div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-xl font-bold text-[#07da63]">{job.budget} <span className="text-[10px] text-[#6b7280] uppercase">USDC</span></div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleApply(); }}
                                        className="bg-transparent border border-[#07da63] text-[#07da63] font-bold px-6 py-1.5 rounded-lg hover:bg-[#07da63]/10 transition-colors text-sm flex items-center gap-2"
                                    >
                                        Apply Now <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Panels (35%) */}
            <aside className="hidden xl:block flex-[0.35] h-screen sticky top-[60px] p-4 space-y-4">
                {/* Your Applications */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Your Applications</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 rounded-xl bg-[#111111] border border-[#1a1a1a]">
                            <p className="text-xl font-bold text-white">{applicationCount}</p>
                            <p className="text-[10px] text-[#6b7280] font-bold uppercase">Applied</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-[#111111] border border-[#1a1a1a]">
                            <p className="text-xl font-bold text-white">1</p>
                            <p className="text-[10px] text-[#6b7280] font-bold uppercase">Interviews</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-[#111111] border border-[#1a1a1a]">
                            <p className="text-xl font-bold text-white">5</p>
                            <p className="text-[10px] text-[#6b7280] font-bold uppercase">Saved</p>
                        </div>
                    </div>
                    <Link href="#" className="text-[#07da63] text-sm font-bold hover:underline block text-center py-1">View All Applications →</Link>
                </div>

                {/* Free Tier Notice */}
                <div className="bg-[#0d0d0d] border border-yellow-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2 text-yellow-500">
                        <AlertTriangle size={18} />
                        <h4 className="font-bold text-sm">Free Tier Notice</h4>
                    </div>
                    <p className="text-[#6b7280] text-sm mb-4 font-medium">
                        You have <strong className="text-white">{2 - applicationCount}</strong> applications remaining today.
                    </p>
                    <Link href="/dashboard/premium" className="bg-[#07da63] text-black font-bold w-full py-2 rounded-full hover:bg-[#08f26e] transition-colors flex items-center justify-center gap-2 text-sm">
                        <Sparkles size={16} /> Upgrade to Premium
                    </Link>
                </div>

                {/* Top Hiring Founders */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Top Hiring Founders</h3>
                    <div className="space-y-4">
                        <FounderItem name="Alex Rivera" handle="@alex" hires="12" img="https://i.pravatar.cc/150?u=alex" />
                        <FounderItem name="Sarah Chen" handle="@sarah" hires="8" img="https://i.pravatar.cc/150?u=sarah" />
                        <FounderItem name="Marcus T." handle="@marcus" hires="5" img="https://i.pravatar.cc/150?u=marcus" />
                    </div>
                </div>
            </aside>

            {/* Limit Modal */}
            <AnimatePresence>
                {showLimitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowLimitModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-[400px] bg-black border border-[#1a1a1a] rounded-2xl p-8 relative z-[101] text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
                                    <AlertTriangle size={32} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">You've reached your daily limit</h2>
                            <p className="text-[#6b7280] mb-8 font-medium">
                                Free users are limited to 2 applications per day. Upgrade to Premium for unlimited applications and priority access.
                            </p>
                            <div className="space-y-3">
                                <Link href="/dashboard/premium" className="block bg-[#07da63] text-black font-bold w-full py-3 rounded-full hover:bg-[#08f26e] transition-colors">
                                    Get Premium — $5 USDC
                                </Link>
                                <button
                                    onClick={() => setShowLimitModal(false)}
                                    className="block w-full text-[#6b7280] font-bold py-2 hover:text-white transition-colors"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function FounderItem({ name, handle, hires, img }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <img src={img} alt={name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-[15px] group-hover:underline leading-tight">{name}</p>
                    <p className="text-[#6b7280] text-sm leading-tight">{handle}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-[#07da63]">{hires} Hires</span>
            </div>
        </div>
    )
}
