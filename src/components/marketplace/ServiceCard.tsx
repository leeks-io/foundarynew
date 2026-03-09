'use client'

import { Star, Clock, User, Sparkles, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
    title: string
    provider: string
    price: number
    rating: number
    deliveryTime: number
    image?: string
    avatar?: string
    isPremium?: boolean
    onClick?: () => void
}

export default function ServiceCard({
    title, provider, price, rating, deliveryTime, image, avatar, isPremium, onClick
}: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden group cursor-pointer flex flex-col hover:border-[#07da63]/50 transition-all duration-300 relative"
        >
            {/* Service Thumbnail */}
            <div className="h-44 bg-[#111111] relative overflow-hidden">
                <img
                    src={image || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80&u=${title}`}
                    alt={title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent opacity-80" />

                {/* View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <button className="bg-[#07da63] text-black font-bold px-6 py-2 rounded-lg text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        View Service
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                {/* Creator Row */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] overflow-hidden border border-[#1a1a1a]">
                        <img src={avatar || `https://i.pravatar.cc/150?u=${provider}`} alt={provider} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-[#6b7280] group-hover:text-white transition-colors flex items-center gap-1">
                        {provider} {isPremium && <CheckCircle2 size={10} className="text-[#07da63]" />}
                    </span>
                </div>

                <h3 className="font-bold text-[15px] mb-4 leading-tight group-hover:text-[#07da63] transition-colors line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center gap-1 text-[#07da63] mb-4">
                    <Star size={14} className="fill-[#07da63]" />
                    <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
                    <span className="text-[#6b7280] text-xs font-medium ml-1">(48 reviews)</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1a1a1a]">
                    <div className="flex items-center gap-1 text-[#6b7280]">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{deliveryTime} Days</span>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-[#07da63]">{price} USDC</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
