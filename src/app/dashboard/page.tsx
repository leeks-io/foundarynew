'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Image as ImageIcon, Lightbulb, Rocket, MapPin,
    MessageCircle, Repeat, Heart, BarChart2, Share,
    CheckCircle2, MoreHorizontal, Sparkles, TrendingUp,
    Search, Briefcase, Zap
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import SocialPost from '@/components/dashboard/SocialPost'
import { useAuth } from '@/hooks/useAuth'
import { useFeed } from '@/hooks/useFeed'
import { useJobs } from '@/hooks/useJobs'
import { useFounderStats, useJobSeekerStats, useFreelancerStats } from '@/hooks/useDashboard'
import { createPost } from '@/lib/queries/feed'
import { PostSkeleton } from '@/components/skeletons/PostSkeleton'
import { SidebarSkeleton } from '@/components/skeletons/SidebarSkeleton'
import { JobsSkeleton } from '@/components/skeletons/JobsSkeleton'

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('foryou')
    const [newPostContent, setNewPostContent] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const { user: currentUser } = useAuth()

    const { data: posts, isLoading: postsLoading } = useFeed()
    const { data: jobs, isLoading: jobsLoading } = useJobs()
    const { data: founderStats } = useFounderStats()
    const { data: dashboardSeeker } = useJobSeekerStats()

    // We can filter posts based on activeTab if needed, but for now we follow useFeed
    const displayPosts = posts || []

    const handlePostSubmit = async () => {
        if (!newPostContent.trim() || !currentUser) return
        setIsPosting(true)

        try {
            await createPost(currentUser.id, newPostContent)
            setNewPostContent('')
        } catch (error) {
            console.error(error)
        } finally {
            setIsPosting(false)
        }
    }


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
                        <img src={currentUser?.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${currentUser?.id || 'default'}`} alt="Me" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 pt-2">
                        <textarea
                            placeholder="What are you building?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
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
                            <button
                                onClick={handlePostSubmit}
                                disabled={isPosting || !newPostContent.trim()}
                                className="bg-[#07da63] text-black font-bold px-5 py-1.5 rounded-full hover:bg-[#08f26e] transition-colors disabled:opacity-50"
                            >
                                {isPosting ? '...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-[#1a1a1a]">
                    {postsLoading ? (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : (
                        displayPosts.length > 0 ? displayPosts.map((post: any) => (
                            <SocialPost
                                key={post.id}
                                name={post.users?.username || 'Anonymous'}
                                handle={`@${post.users?.username || 'anon'}`}
                                time={formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                role={post.users?.role}
                                content={post.content}
                                likes={post.likes_count || 0}
                                comments={post.replies_count || 0}
                                avatar={post.users?.profiles?.profile_image || `https://i.pravatar.cc/150?u=${post.user_id}`}
                                isPremium={post.users?.is_premium}
                            />
                        )) : (
                            <div className="p-12 text-center">
                                <Sparkles className="mx-auto mb-4 text-[#6b7280] opacity-20" size={48} />
                                <p className="text-[#6b7280] font-bold">Your feed is empty.</p>
                                <p className="text-xs text-[#6b7280]/60 mt-2">Follow builders or post an update to get started.</p>
                            </div>
                        )
                    )}
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
                        <span className="text-3xl font-bold text-[#07da63]">{currentUser?.user_metadata?.builder_score || 0}</span>
                        <span className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Foundry Builder</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#07da63] w-[10%]" />
                    </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Trending Builders</h3>
                    <div className="space-y-4">
                        {postsLoading ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                                    <div className="h-4 bg-[#1a1a1a] rounded w-1/2" />
                                </div>
                                <div className="flex items-center gap-3 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                                    <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-[#6b7280] py-2">No trending builders today.</p>
                        )}
                    </div>
                </div>

                {/* Active Jobs */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Active Jobs</h3>
                    <div className="space-y-4">
                        {jobsLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-4 bg-[#1a1a1a] rounded w-full" />
                                <div className="h-3 bg-[#1a1a1a] rounded w-2/3" />
                            </div>
                        ) : jobs && jobs.length > 0 ? jobs.map((job: any) => (
                            <div key={job.title} className="group cursor-pointer">
                                <p className="font-bold text-[15px] group-hover:underline">{job.title}</p>
                                <p className="text-[#6b7280] text-sm">${job.budget}/mo</p>
                            </div>
                        )) : (
                            <p className="text-xs text-[#6b7280] py-2">No active jobs found.</p>
                        )}
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
