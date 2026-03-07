'use client'

import { Check, Shield, Zap, Rocket, Globe, Zap as ZapIcon } from 'lucide-react'

export default function PremiumPage() {
    const benefits = [
        'Unlimited service listings',
        'Unlimited job applications',
        'Unlimited job posts',
        'Startup For Sale marketplace access',
        'Premium Glow Label badge',
        'Zero platform fees',
        'Access to Foundry Live Spaces'
    ]

    return (
        <div className="max-w-6xl mx-auto py-20 px-6">
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">
                    Phase 4: Web3 Payments
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-tight">
                    Unlock Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Service Agency</span>
                </h1>
                <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium">
                    List your services, get orders, and earn in USDC. Join the elite network of internet builders.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Pricing Card */}
                <div className="glass p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Rocket className="w-64 h-64 text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 rounded-3xl bg-primary glow-primary">
                                <ZapIcon className="w-8 h-8 text-white fill-white" />
                            </div>
                            <div>
                                <div className="text-xs font-black text-white/40 uppercase tracking-widest">Foundry Premium</div>
                                <div className="text-2xl font-black">LIFETIME ACCESS</div>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-12">
                            <span className="text-6xl font-black italic tracking-tighter">$5</span>
                            <span className="text-white/40 font-bold uppercase tracking-widest">USDC / Month</span>
                        </div>

                        <div className="space-y-6 mb-12">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-accent" />
                                    </div>
                                    <span className="text-white/60 font-semibold">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-6 bg-primary text-white rounded-[2rem] font-black italic uppercase tracking-[0.2em] glow-primary hover:scale-[1.02] transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 group">
                            Get Premium Now
                            <Zap className="w-5 h-5 group-hover:fill-white transition-all" />
                        </button>
                        <p className="text-center mt-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            Pay with USDC on Solana · Instant Activation
                        </p>
                    </div>
                </div>

                {/* Info Side */}
                <div className="space-y-12">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex gap-6 hover:border-primary/30 transition-colors">
                        <div className="shink-0 p-4 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                            <p className="text-white/40 text-sm leading-relaxed font-medium">
                                All transactions are secured by audited smart contracts on the Solana blockchain. No credit cards required.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex gap-6 hover:border-accent/30 transition-colors">
                        <div className="shink-0 p-4 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Globe className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Verified Reputation</h3>
                            <p className="text-white/40 text-sm leading-relaxed font-medium">
                                Premium users get a special glow badge and priority placement in search results and leaderboards.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4 italic uppercase">Treasury Address</h3>
                            <code className="block p-4 bg-[#0B0F19]/80 rounded-xl text-xs font-mono text-accent break-all border border-accent/20">
                                FpMGXWfCgQz3j9isPEEKNBrewyrdJ8siufymqFcYfL9
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
