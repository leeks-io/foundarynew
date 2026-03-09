'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 border-b border-[#1a1a1a] overflow-hidden">
            {/* Subtle radial pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#07da63]/10 border border-[#07da63]/20 text-[10px] font-bold text-[#07da63] uppercase tracking-[0.2em] mb-8"
                >
                    <Sparkles size={12} className="fill-current" /> The Future of Internet Building
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]"
                >
                    Build, Launch & <br />
                    <span className="text-[#07da63]">Trade Startups</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#6b7280] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                >
                    Foundry is the specialized network for internet builders. Connect with founders, hire talent, and trade digital assets on-chain.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/dashboard" className="w-full sm:w-auto px-10 py-4 bg-[#07da63] text-black rounded-xl font-bold text-lg hover:bg-[#08f26e] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(7,218,99,0.2)]">
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <Link href="/auth?mode=signup" className="w-full sm:w-auto px-10 py-4 bg-transparent border border-[#1a1a1a] text-white rounded-xl font-bold text-lg hover:bg-white/5 transition-all">
                        Join Community
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
