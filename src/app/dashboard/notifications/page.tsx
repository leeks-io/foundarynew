'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart, Repeat, UserPlus, Zap, MessageSquare,
    Settings, CheckCircle2, Star, DollarSign, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('all')

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'verified', label: 'Verified' },
        { id: 'mentions', label: 'Mentions' },
    ]

    const notifications = [
        {
            id: 1,
            type: 'like',
            user: 'Sarah Chen',
            handle: '@sarah',
            content: 'liked your post',
            subtext: 'Building the next generation of Web3 marketplaces...',
            time: '2h',
            icon: <Heart size={20} className="text-pink-500 fill-pink-500" />,
            avatar: 'https://i.pravatar.cc/150?u=sarah'
        },
        {
            id: 2,
            type: 'deal',
            user: 'Nexus AI',
            handle: '@nexus',
            content: 'sent you a deal proposal',
            subtext: 'Landing Page Design · 250 USDC',
            time: '4h',
            icon: <Zap size={20} className="text-[#07da63] fill-[#07da63]" />,
            avatar: 'https://i.pravatar.cc/150?u=nexus'
        },
        {
            id: 3,
            type: 'follow',
            user: 'Alex Rivera',
            handle: '@alex',
            content: 'followed you',
            time: '6h',
            icon: <UserPlus size={20} className="text-[#07da63]" />,
            avatar: 'https://i.pravatar.cc/150?u=alex'
        },
        {
            id: 4,
            type: 'repost',
            user: 'Elena Vogt',
            handle: '@elena',
            content: 'reposted your post',
            subtext: 'Just integrated Solana Pay into the checkout flow!',
            time: '8h',
            icon: <Repeat size={20} className="text-blue-500" />,
            avatar: 'https://i.pravatar.cc/150?u=elena'
        },
    ]

    return (
        <div className="flex flex-col flex-1 min-w-0">
            {/* Sticky Top Bar */}
            <div className="sticky top-[60px] z-30 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
                <div className="px-4 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Notifications</h2>
                    <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"><Settings size={20} /></button>
                </div>
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 py-4 hover:bg-[#111111] transition-all relative group"
                        >
                            <span className={cn("text-[15px] px-2", activeTab === tab.id ? "font-bold text-white" : "font-medium text-[#6b7280]")}>
                                {tab.label}
                            </span>
                            {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#07da63] rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications Feed */}
            <div className="divide-y divide-[#1a1a1a]">
                <AnimatePresence mode="popLayout">
                    {notifications.map(notif => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 hover:bg-[#080808] transition-colors cursor-pointer flex gap-3 group"
                        >
                            <div className="shrink-0 pt-1">
                                {notif.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-full overflow-hidden mb-2">
                                    <img src={notif.avatar} alt={notif.user} />
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="font-bold text-[15px]">{notif.user}</span>
                                    <span className="text-[#6b7280] text-[15px]">{notif.content}</span>
                                    <span className="text-[#6b7280] text-xs ml-auto">{notif.time}</span>
                                </div>
                                {notif.subtext && (
                                    <p className="text-[#6b7280] text-[15px] font-medium leading-normal line-clamp-2">
                                        {notif.subtext}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State / Footer */}
            <div className="p-8 text-center text-[#6b7280] border-t border-[#1a1a1a]">
                <p className="text-sm">You've reached the end of your notifications.</p>
            </div>
        </div>
    )
}
