'use client'

import { motion } from 'framer-motion'
import {
    CheckCircle2, Sparkles, Zap, ShieldCheck, CreditCard,
    Rocket, Users, Briefcase, Globe, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function PremiumPage() {
    const annualPrice = 4.16 // $50 / 12
    const monthlyPrice = 5.00

    const features = [
        { title: "Builder Verification", desc: "Get the prestigious green checkmark on your profile.", icon: <CheckCircle2 className="text-[#07da63]" /> },
        { title: "Priority Support", desc: "Get your disputes and tickets resolved in under 12 hours.", icon: <ShieldCheck className="text-[#07da63]" /> },
        { title: "Unlimited Applications", desc: "Apply for as many jobs as you want. No daily limits.", icon: <Zap className="text-[#07da63]" /> },
        { title: "Startup Marketplace", desc: "Browse and buy verified profitable internet businesses.", icon: <Rocket className="text-[#07da63]" /> },
        { title: "Zero Platform Fees", desc: "Keep 100% of your earnings. No marketplace commissions.", icon: <Globe className="text-[#07da63]" /> },
    ]

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-[#07da63]/10 rounded-[2rem] flex items-center justify-center text-[#07da63] mx-auto mb-8 shadow-[0_0_40px_rgba(7,218,99,0.15)]"
                >
                    <Sparkles size={40} className="fill-current" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Foundry Premium</h1>
                <p className="text-[#6b7280] text-lg max-w-xl mx-auto font-medium">
                    The ultimate membership for specialized internet builders. Build faster, earn more, and scale your network.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Monthly Plan */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-[#07da63]/30 transition-all">
                    <h3 className="text-xl font-bold mb-2">Monthly</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold text-white">${monthlyPrice}</span>
                        <span className="text-[#6b7280] font-bold uppercase tracking-widest text-[10px]">USDC / mo</span>
                    </div>
                    <button className="w-full bg-[#07da63] text-black font-bold h-12 rounded-full hover:bg-[#08f26e] transition-colors mb-4">
                        Subscribe Monthly
                    </button>
                    <p className="text-[11px] text-[#6b7280] font-bold uppercase tracking-widest leading-none">Billed monthly</p>
                </div>

                {/* Annual Plan */}
                <div className="bg-[#0d0d0d] border border-[#07da63] rounded-[2.5rem] p-10 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 right-6 bg-[#07da63] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Save 17%</div>
                    <h3 className="text-xl font-bold mb-2">Annual</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold text-white">${annualPrice.toFixed(2)}</span>
                        <span className="text-[#6b7280] font-bold uppercase tracking-widest text-[10px]">USDC / mo</span>
                    </div>
                    <button className="w-full bg-[#07da63] text-black font-bold h-12 rounded-full hover:bg-[#08f26e] transition-colors mb-4 shadow-[0_0_20px_rgba(7,218,99,0.3)]">
                        Subscribe Annually
                    </button>
                    <p className="text-[11px] text-[#6b7280] font-bold uppercase tracking-widest leading-none">Billed annually ($50 USDC)</p>
                </div>
            </div>

            <div className="space-y-4 mb-20">
                <h2 className="text-2xl font-bold mb-8 text-center">Premium Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map(f => (
                        <div key={f.title} className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-3xl flex items-start gap-4">
                            <div className="shrink-0 pt-1">
                                {f.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">{f.title}</h4>
                                <p className="text-[#6b7280] text-sm font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[2.5rem] p-10 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#07da63]/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-black rounded-xl border border-[#1a1a1a] flex items-center justify-center text-[#07da63]">
                            <CreditCard size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Treasury Address</h3>
                    </div>
                    <p className="text-[#6b7280] text-sm font-medium mb-6 max-w-lg">
                        You can also subscribe manually by sending the exact USDC amount to our Solana treasury. Your account will be activated automatically.
                    </p>
                    <div className="bg-black p-4 rounded-xl border border-[#1a1a1a] group cursor-pointer hover:border-[#07da63]/50 transition-colors">
                        <code className="text-[#07da63] text-xs font-mono break-all group-hover:text-white transition-colors">
                            FpMGXWfCgQz3j9isPEEKNBrewyrdJ8siufymqFcYfL9
                        </code>
                    </div>
                </div>
            </div>
        </div>
    )
}
