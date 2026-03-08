'use client'

import { TrendingUp, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface StartupCardProps {
    name: string
    revenue: number
    users: number
    price: number
}

export default function StartupCard({ name, revenue, users, price }: StartupCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-[3rem] p-10 group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
                <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black italic text-2xl text-white/20 group-hover:text-primary group-hover:bg-primary/5 transition-all duration-500">
                        {name.charAt(0)}
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-[9px] font-black text-accent uppercase tracking-[0.2em]">
                        Acquisition Opportunity
                    </div>
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-3 leading-none group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-white/30 text-sm font-medium mb-10 leading-relaxed max-w-sm">Verified digital asset with consistent performance metrics and active builder support.</p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest mb-2">
                            <TrendingUp className="w-3 h-3" />
                            Monthly Revenue
                        </div>
                        <div className="text-xl font-black italic uppercase text-white">${revenue.toLocaleString()}</div>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest mb-2">
                            <Users className="w-3 h-3" />
                            Total Users
                        </div>
                        <div className="text-xl font-black italic uppercase text-white">{users.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Asking Price</div>
                    <div className="text-2xl font-black italic uppercase text-accent tracking-tighter">${price.toLocaleString()}</div>
                </div>
                <button className="w-14 h-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary transition-all group-hover:glow-primary group-hover:scale-110">
                    <ArrowRight className="w-6 h-6 text-white" />
                </button>
            </div>
        </motion.div>
    )
}

