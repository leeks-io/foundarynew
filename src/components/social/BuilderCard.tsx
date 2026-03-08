'use client'

import { CheckCircle2, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

interface BuilderCardProps {
    name: string
    role: string
    score: number
    isPremium?: boolean
}

export default function BuilderCard({ name, role, score, isPremium }: BuilderCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-card rounded-[2.5rem] p-8 group cursor-pointer relative overflow-hidden flex flex-col items-center text-center"
        >
            {isPremium && (
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-bl-2xl border-l border-b border-white/5">
                    Vetted Builder
                </div>
            )}

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 p-1 relative mb-6 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.25rem] bg-[#0B0F19]/80 flex items-center justify-center border border-white/5 overflow-hidden">
                    <span className="text-3xl font-black italic text-white/10 uppercase">{name.charAt(0)}</span>
                </div>
                {isPremium && (
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-accent rounded-full glow-accent">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B0F19]" />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-1">{name}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">{role}</p>

            <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5 mb-8">
                <Trophy className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Foundry Score: <span className="text-accent">{score}</span>
                </span>
            </div>

            <button className="w-full py-3.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 glow-primary">
                View Profile
            </button>
        </motion.div>
    )
}

