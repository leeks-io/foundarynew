'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    CheckCircle2, MapPin, Link as LinkIcon, Calendar,
    MessageSquare, UserPlus, Zap, MoreHorizontal,
    ShieldCheck, Star, Briefcase, Rocket, Sparkles, TrendingUp, Edit3
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import SocialPost from '@/components/dashboard/SocialPost'
import ServiceCard from '@/components/marketplace/ServiceCard'
import StartupCard from '@/components/marketplace/StartupCard'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts')
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [userPosts, setUserPosts] = useState<any[]>([])
    const [userServices, setUserServices] = useState<any[]>([])
    const [userStartups, setUserStartups] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) return

            setUser(authUser)

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('users')
                .select('*, profiles(*)')
                .eq('id', authUser.id)
                .single()

            if (profileData) setProfile(profileData)

            // Fetch User Content
            const { data: posts } = await supabase
                .from('posts')
                .select('*, users(username, profiles(profile_image))')
                .eq('user_id', authUser.id)
                .order('created_at', { ascending: false })

            const { data: services } = await supabase
                .from('services')
                .select('*')
                .eq('user_id', authUser.id)

            const { data: startups } = await supabase
                .from('startups')
                .select('*')
                .eq('user_id', authUser.id)

            if (posts) setUserPosts(posts)
            if (services) setUserServices(services)
            if (startups) setUserStartups(startups)

            setLoading(false)
        }

        fetchProfile()
    }, [supabase])

    if (loading) return <div className="flex-1 p-8 text-center text-[#6b7280]">Loading profile...</div>
    if (!profile) return <div className="flex-1 p-8 text-center text-[#6b7280]">Profile not found.</div>

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
                                        src={profile.profiles?.profile_image || `https://i.pravatar.cc/150?u=${profile.id}`}
                                        alt={profile.username}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 border-2 border-[#07da63] rounded-full pointer-events-none" />
                                </div>
                            </div>
                            <div className="pt-[70px] flex gap-2">
                                <button className="p-2 border border-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                                {user?.id === profile.id ? (
                                    <button className="bg-white text-black font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity text-sm flex items-center gap-2">
                                        <Edit3 size={16} /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button className="p-2 border border-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                                            <MessageSquare size={20} />
                                        </button>
                                        <button className="bg-white text-black font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity text-sm">
                                            Follow
                                        </button>
                                        <button className="bg-[#07da63] text-black font-bold px-5 py-2 rounded-full hover:bg-[#08f26e] transition-colors text-sm flex items-center gap-1">
                                            <Zap size={14} className="fill-current" /> Hire
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h1 className="text-xl font-bold flex items-center gap-1.5">
                                {profile.username} <CheckCircle2 size={18} className="text-[#07da63]" />
                                {profile.is_premium && (
                                    <span className="text-[10px] bg-[#07da63]/10 text-[#07da63] px-2 py-0.5 rounded border border-[#07da63]/20 font-bold uppercase tracking-widest flex items-center gap-1 glow-primary">
                                        <Sparkles size={10} /> Premium
                                    </span>
                                )}
                            </h1>
                            <p className="text-[#6b7280] text-[15px] mb-3">@{profile.username}</p>
                            <p className="text-[15px] leading-relaxed mb-4 max-w-xl">
                                {profile.profiles?.bio || "No bio yet."}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {profile.skills?.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 bg-transparent border border-[#07da63]/30 text-[#07da63] text-xs font-bold rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#6b7280] text-[15px]">
                                <span className="flex items-center gap-1"><MapPin size={16} /> {profile.profiles?.location || "Remote"}</span>
                                {profile.profiles?.website && (
                                    <span className="flex items-center gap-1"><LinkIcon size={16} /> <a href={profile.profiles.website} target="_blank" className="text-[#07da63] hover:underline">{profile.profiles.website.replace('https://', '')}</a></span>
                                )}
                                <span className="flex items-center gap-1"><Calendar size={16} /> Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                            </div>

                            <div className="flex gap-4 mt-3 text-[15px]">
                                <span className="hover:underline cursor-pointer"><strong className="text-white">0</strong> <span className="text-[#6b7280]">Following</span></span>
                                <span className="hover:underline cursor-pointer"><strong className="text-white">0</strong> <span className="text-[#6b7280]">Followers</span></span>
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
                                        <span className="text-3xl font-bold text-[#07da63]">{profile.builder_score || 0}</span>
                                        <span className="text-xs bg-[#07da63]/10 text-[#07da63] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Builder</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Services</p><p className="font-bold">{userServices.length}</p></div>
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Posts</p><p className="font-bold">{userPosts.length}</p></div>
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Startups</p><p className="font-bold">{userStartups.length}</p></div>
                                    <div><p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-tighter">Rating</p><p className="font-bold">5.0★</p></div>
                                </div>
                            </div>
                            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <div className="h-full bg-[#07da63] w-[10%]" />
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
                    {activeTab === 'posts' && (
                        userPosts.length > 0 ? userPosts.map(post => (
                            <SocialPost
                                key={post.id}
                                name={profile.username}
                                handle={`@${profile.username}`}
                                time={formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                role={profile.role}
                                content={post.content}
                                likes={post.likes_count || 0}
                                comments={post.replies_count || 0}
                                avatar={profile.profiles?.profile_image || `https://i.pravatar.cc/150?u=${profile.id}`}
                                isPremium={profile.is_premium}
                            />
                        )) : (
                            <div className="p-10 text-center text-[#6b7280]">No posts yet.</div>
                        )
                    )}

                    {activeTab === 'services' && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userServices.length > 0 ? userServices.map(service => (
                                <ServiceCard
                                    key={service.id}
                                    title={service.title}
                                    provider={profile.username}
                                    price={service.price_usdc}
                                    rating={service.rating || 5.0}
                                    deliveryTime={service.delivery_days || 7}
                                    image={service.images?.[0]}
                                    avatar={profile.profiles?.profile_image}
                                    isPremium={profile.is_premium}
                                />
                            )) : (
                                <div className="col-span-2 p-10 text-center text-[#6b7280]">No services listed.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'startups' && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userStartups.length > 0 ? userStartups.map(startup => (
                                <StartupCard
                                    key={startup.id}
                                    name={startup.name}
                                    revenue={startup.metrics?.revenue || 0}
                                    users={startup.metrics?.users || 0}
                                    price={startup.price_usdc}
                                    industry={startup.industry}
                                    logo={startup.logo_url}
                                />
                            )) : (
                                <div className="col-span-2 p-10 text-center text-[#6b7280]">No startups posted.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div className="p-10 text-center text-[#6b7280]">Portfolio items coming soon.</div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="p-10 text-center text-[#6b7280]">No reviews yet.</div>
                    )}
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
                        {userServices.length > 0 ? userServices.slice(0, 3).map(service => (
                            <Link href="/dashboard/services" key={service.id} className="group block">
                                <p className="font-bold text-[15px] group-hover:underline">{service.title}</p>
                                <p className="text-[#07da63] text-sm font-bold">{service.price_usdc} USDC</p>
                            </Link>
                        )) : (
                            <p className="text-[#6b7280] text-sm">No active services.</p>
                        )}
                    </div>
                </div>

                {/* Startups */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <h3 className="text-xl font-bold mb-4">Startups</h3>
                    <div className="space-y-4">
                        {userStartups.length > 0 ? userStartups.slice(0, 2).map(startup => (
                            <Link href="/dashboard/startups" key={startup.id} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#07da63]">
                                    {startup.logo_url ? <img src={startup.logo_url} className="w-6 h-6 object-contain" /> : <Rocket size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-[15px] group-hover:underline">{startup.name}</p>
                                    <p className="text-[#6b7280] text-xs">{startup.industry} · {startup.stage}</p>
                                </div>
                            </Link>
                        )) : (
                            <p className="text-[#6b7280] text-sm">No startups posted.</p>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    )
}
