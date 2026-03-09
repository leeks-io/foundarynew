'use client'

import { CheckCircle2, MessageCircle, Repeat, Heart, BarChart2, Share, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialPostProps {
    name: string
    handle: string
    time: string
    role?: string
    content: string
    likes: number
    comments: number
    reposts?: number
    views?: number
    avatar: string
    isPremium?: boolean
}

export default function SocialPost({
    name, handle, time, role, content, likes, comments, reposts = 0, views = 0, avatar, isPremium
}: SocialPostProps) {
    return (
        <div className="p-4 hover:bg-[#080808] transition-colors cursor-pointer group flex gap-3 border-b border-[#1a1a1a]">
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
