'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Image as ImageIcon, Lightbulb, Rocket, MapPin,
    MessageCircle, Repeat, Heart, BarChart2, Share,
    CheckCircle2, MoreHorizontal, Sparkles, TrendingUp,
    Search, Briefcase, Zap
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('foryou')

    return (
        <>
            {/* Center Feed Area */}
            <div className="flex-1 min-w-0 border-r border-[#1a1a1a]">
                {/* Sticky Top Bar */}
                <div className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
                    <div className="px-4 py-3">
                        <h2 className="text-xl font-bold">Home</h2>
                    </div>
                    <div className="flex">
                        <TabItem label="For You" active={activeTab === 'foryou'} onClick={() => setActiveTab('foryou')} />
                        <TabItem label="Following" active={activeTab === 'following'} onClick={() => setActiveTab('following')} />
                        <TabItem label="Trending" active={activeTab === 'trending'} onClick={() => setActiveTab('trending')} />
                    </div>
                </div>

                {/* Post Composer */}
                <div className="p-4 border-b border-[#1a1a1a] flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shrink-0 overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=david" alt="Me" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 pt-2">
                        <textarea
                            placeholder="What are you building?"
                            className="w-full bg-transparent border-none focus:outline-none text-xl placeholder:text-[#6b7280] resize-none mb-4"
                            rows={2}
                        />
                        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                            <div className="flex items-center gap-1 text-[#07da63]">
                                <button className="p-2 hover:bg-[#07da63]/10 rounded-full transition-colors"><ImageIcon size={18} /></button>
                                <button className="p-2 hover:bg-[#07da63]/10 rounded-full transition-colors"><Lightbulb size={18} /></button>
                                <button className="p-2 hover:bg-[#07da63]/10 rounded-full transition-colors"><Rocket size={18} /></button>
                                <button className="p-2 hover:bg-[#07da63]/10 rounded-full transition-colors"><MapPin size={18} /></button>
                            </div>
                            <button className="bg-[#07da63] text-black font-bold px-5 py-1.5 rounded-full hover:bg-[#08f26e] transition-colors">
                                Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feed Posts */}
                <div className="divide-y divide-[#1a1a1a]">
                    <SocialPost
                        name="Sarah Chen" @sarahbuilds" time="2h"
                    role="Founder"
                    content="Just crossed $1k MRR with my AI payroll tool! 🚀 The builder community here has been instrumental in our early growth. Next stop: $5k."
                    likes="142" comments="24" reposts="12" views="2.4k"
                    avatar="https://i.pravatar.cc/150?img=47"
                    isPremium
          />
                    <SocialPost
                        name="Alex Rivera" @alex" time="4h"
                    role="Talent"
                    content="Looking for a React/Solana developer to help with a new marketplace blueprint. Anyone interested in joining the build? DM me! ⬡"
                    likes="86" comments="15" reposts="8" views="1.8k"
                    avatar="https://i.pravatar.cc/150?img=33"
          />
                    <BlueprintPost
                        title="AI tool that summarizes WhatsApp voice notes"
                        tags={["SaaS", "AI"]}
                        interested="42" building="12"
                    />
                    <SocialPost
                        name="Marcus Thorne" @marcus" time="6h"
                    role="Freelancer"
                    content="Completed 3 smart contract audits this week. Open for new gigs! Check my services tab for pricing. 🔒"
                    likes="124" comments="12" reposts="10" views="3.1k"
                    avatar="https://i.pravatar.cc/150?img=12"
                    isPremium
          />
                </div>
            </div>

            {/* Right Content Panel */}
            <aside className="hidden lg:block w-[300px] shrink-0 h-screen sticky top-[60px] p-4 space-y-4">
                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                    <input
                        type="text"
                        placeholder="Search Foundry"
                        className="w-full bg-[#16181c] border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                    />
                </div>

                {/* Builder Score */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Builder Score</h3>
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-3xl font-bold text-[#07da63]">842</span>
                        <span className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Top 5% Founder</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#07da63] w-[84%]" />
                    </div>
                </div>

                {/* Trending Builders */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Trending Builders</h3>
                    <div className="space-y-4">
                        <TrendingUser name="Elena V." @elena" score="910" img="https://i.pravatar.cc/150?img=44" />
                        <TrendingUser name="Marcus T." @marcus" score="885" img="https://i.pravatar.cc/150?img=12" />
                        <TrendingUser name="Sophie L." @sophie" score="840" img="https://i.pravatar.cc/150?img=5" />
                    </div>
                    <button className="w-full mt-4 text-[#07da63] text-sm font-bold hover:underline py-2">
                        Show more
                    </button>
                </div>

                {/* Active Jobs */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Active Jobs</h3>
                    <div className="space-y-4">
                        <div className="group cursor-pointer">
                            <p className="font-bold text-[15px] group-hover:underline">Senior React Engineer</p>
                            <p className="text-[#6b7280] text-sm">Foundry Lab · $5k/mo</p>
                        </div>
                        <div className="group cursor-pointer">
                            <p className="font-bold text-[15px] group-hover:underline">Product Designer</p>
                            <p className="text-[#6b7280] text-sm">Nexus AI · $4k/mo</p>
                        </div>
                    </div>
                </div>

                {/* Premium Upgrade */}
                <div className="bg-[#0d0d0d] border border-[#07da63]/30 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#07da63]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                    <p className="text-[#6b7280] text-sm mb-4 font-medium">Get a verified badge, lower fees, and featured listings.</p>
                    <button className="bg-[#07da63] text-black font-bold w-full py-2 rounded-full hover:bg-[#08f26e] transition-colors">
                        Get Premium
                    </button>
                </div>

                {/* Small Footer */}
                <div className="px-4 text-[13px] text-[#6b7280] flex flex-wrap gap-x-4 gap-y-1">
                    <Link href="#" className="hover:underline">Terms of Service</Link>
                    <Link href="#" className="hover:underline">Privacy Policy</Link>
                    <Link href="#" className="hover:underline">Cookie Policy</Link>
                    <Link href="#" className="hover:underline">Accessibility</Link>
                    <Link href="#" className="hover:underline">Ads info</Link>
                    <span>© 2025 Foundry Network</span>
                </div>
            </aside>
        </>
    )
}

// --- Local Components ---

function TabItem({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex-1 py-4 hover:bg-[#111111] transition-all relative group"
        >
            <span className={cn("text-[15px] px-2", active ? "font-bold text-white" : "font-medium text-[#6b7280]")}>
                {label}
            </span>
            {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#07da63] rounded-full" />}
        </button>
    )
}

function SocialPost({ name, handle, time, role, content, likes, comments, reposts, views, avatar, isPremium }: any) {
    return (
        <div className="p-4 hover:bg-[#080808] transition-colors cursor-pointer group flex gap-3">
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold hover:underline text-[15px]">{name}</span>
                        {isPremium && <CheckCircle2 size={14} className="text-[#07da63]" />}
                        <span className="text-[#6b7280] text-sm">{handle} · {time}</span>
                        {role && (
                            <span className="text-[10px] bg-[#1a1a1a] text-[#07da63] font-bold px-1.5 py-0.5 rounded border border-[#07da63]/20 uppercase tracking-widest">
                                {role}
                            </span>
                        )}
                    </div>
                    <button className="text-[#6b7280] hover:text-[#07da63] hover:bg-[#07da63]/10 p-2 rounded-full transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
                <p className="text-[15px] mt-1 leading-normal whitespace-pre-wrap">{content}</p>

                <div className="flex items-center justify-between mt-3 text-[#6b7280] max-w-sm">
                    <button className="flex items-center gap-2 hover:text-[#07da63] transition-colors group/action">
                        <div className="p-2 rounded-full group-hover/action:bg-[#07da63]/10">
                            <MessageCircle size={18} />
                        </div>
                        <span className="text-xs">{comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#07da63] transition-colors group/action">
                        <div className="p-2 rounded-full group-hover/action:bg-[#07da63]/10">
                            <Repeat size={18} />
                        </div>
                        <span className="text-xs">{reposts}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#ff0055] transition-colors group/action">
                        <div className="p-2 rounded-full group-hover/action:bg-[#ff0055]/10">
                            <Heart size={18} />
                        </div>
                        <span className="text-xs">{likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#07da63] transition-colors group/action">
                        <div className="p-2 rounded-full group-hover/action:bg-[#07da63]/10">
                            <BarChart2 size={18} />
                        </div>
                        <span className="text-xs">{views}</span>
                    </button>
                    <button className="hover:text-[#07da63] transition-colors group/action p-2 rounded-full group-hover/action:bg-[#07da63]/10">
                        <Share size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function BlueprintPost({ title, tags, interested, building }: any) {
    return (
        <div className="p-4 border-l-4 border-l-[#07da63] bg-[#0d0d0d]/50 hover:bg-[#0d0d0d] transition-colors">
            <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-[#07da63]" />
                <span className="text-[11px] font-bold text-[#07da63] uppercase tracking-widest">Blueprint Opportunity</span>
            </div>
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <div className="flex gap-2 mb-4">
                {tags.map((tag: any) => (
                    <span key={tag} className="px-2 py-0.5 bg-[#1a1a1a] text-[10px] font-bold text-[#6b7280] uppercase tracking-tighter border border-[#1a1a1a] rounded">{tag}</span>
                ))}
            </div>
            <div className="flex items-center gap-6 mb-4 text-xs font-medium text-[#6b7280]">
                <span><strong className="text-white">{interested}</strong> Interested</span>
                <span><strong className="text-white">{building}</strong> Building</span>
            </div>
            <div className="flex gap-2">
                <button className="flex-1 bg-[#07da63] text-black py-1.5 rounded-lg text-xs font-bold">Join Build</button>
                <button className="flex-1 border border-[#1a1a1a] text-white py-1.5 rounded-lg text-xs font-bold">Buy Idea</button>
            </div>
        </div>
    )
}

function TrendingUser({ name, handle, score, img }: any) {
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
                <span className="text-[15px] font-bold text-[#07da63]">{score}</span>
            </div>
        </div>
    )
}
