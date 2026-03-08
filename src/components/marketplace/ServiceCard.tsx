'use client'

import { Star, Clock, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface ServiceCardProps {
    title: string
    provider: string
    price: number
    rating: number
    deliveryTime: number
    image?: string
}

export default function ServiceCard({ title, provider, price, rating, deliveryTime }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer h-full flex flex-col"
        >
            <div className="aspect-[16/10] bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{provider}</span>
                </div>

                <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span className="text-xs font-black text-white">{rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase">{deliveryTime}d</span>
                    </div>
                    <div className="text-sm font-black italic text-accent uppercase">
                        {price} <span className="text-[9px] text-white/30 not-italic">USDC</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
