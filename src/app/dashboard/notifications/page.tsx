'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart, Repeat, UserPlus, Zap, MessageSquare,
    Settings, CheckCircle2, Star, DollarSign, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('all')

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'verified', label: 'Verified' },
        { id: 'mentions', label: 'Mentions' },
    ]

    const { data: notifications, isLoading, markAsRead } = useNotifications()

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart size={20} className="text-pink-500 fill-pink-500" />
            case 'deal': return <Zap size={20} className="text-[#07da63] fill-[#07da63]" />
            case 'follow': return <UserPlus size={20} className="text-[#07da63]" />
            case 'repost': return <Repeat size={20} className="text-blue-500" />
            default: return <Bell size={20} className="text-[#07da63]" />
        }
    }

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
                {isLoading ? (
                    <div className="p-8 text-center text-[#6b7280]">Loading notifications...</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {notifications?.map((notif: any) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => !notif.is_read && markAsRead(notif.id)}
                                className={cn(
                                    "p-4 hover:bg-[#080808] transition-colors cursor-pointer flex gap-3 group",
                                    !notif.is_read ? "bg-[#07da63]/5" : ""
                                )}
                            >
                                <div className="shrink-0 pt-1">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="w-8 h-8 rounded-full overflow-hidden mb-2">
                                        <img src={notif.notifier?.profiles?.profile_image || `https://i.pravatar.cc/150?u=${notif.notifier?.username}`} alt={notif.notifier?.username} />
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="font-bold text-[15px]">{notif.notifier?.username}</span>
                                        <span className="text-[#6b7280] text-[15px]">{notif.content}</span>
                                        <span className="text-[#6b7280] text-xs ml-auto">
                                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Empty State / Footer */}
            <div className="p-8 text-center text-[#6b7280] border-t border-[#1a1a1a]">
                <p className="text-sm">You've reached the end of your notifications.</p>
            </div>
        </div>
    )
}
