'use client'

import { useRole } from '@/context/RoleContext'
import { CheckCircle2, Star, Globe, Twitter, Github, Linkedin, ExternalLink } from 'lucide-react'

export default function ProfilePage() {
    const { role } = useRole()

    return (
        <div className="max-w-6xl mx-auto pb-40">
            {/* Banner */}
            <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-accent/20 rounded-[2.5rem] relative overflow-hidden mb-20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            </div>

            <div className="px-10 flex flex-col md:flex-row gap-12 -mt-32 relative z-10">
                {/* Left Side: Profile Info */}
                <div className="w-full md:w-80 shrink-0">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 mb-8">
                        <div className="w-32 h-32 rounded-3xl bg-[#0B0F19] p-1 border border-white/10 mx-auto mb-6 relative">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-black text-4xl text-white/50">
                                JD
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-1.5 bg-accent rounded-full glow-accent">
                                <CheckCircle2 className="w-4 h-4 text-[#0B0F19]" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-1">John Doe</h1>
                            <p className="text-sm text-white/40 mb-3 capitalize">{role}</p>
                            <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent">
                                <Star className="w-3 h-3 fill-accent" />
                                FOUNDRY SCORE: 942
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-white/5">
                            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold glow-primary">
                                Follow Builder
                            </button>
                            <button className="w-full py-3 bg-white/5 border border-white/5 text-white rounded-xl font-bold hover:bg-white/10">
                                Send Message
                            </button>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6 text-sm">
                        <div className="flex items-center justify-between text-white/40">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Website
                            </div>
                            <span className="text-white hover:text-primary truncate">doe.build</span>
                        </div>
                        <div className="flex items-center justify-between text-white/40">
                            <div className="flex items-center gap-2">
                                <Twitter className="w-4 h-4" />
                                X / Twitter
                            </div>
                            <span className="text-white hover:text-primary">@johndoe</span>
                        </div>
                        <div className="flex items-center justify-between text-white/40">
                            <div className="flex items-center gap-2">
                                <Github className="w-4 h-4" />
                                GitHub
                            </div>
                            <span className="text-white hover:text-primary">jdoe-dev</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">About</h2>
                        <p className="text-white/60 leading-relaxed max-w-2xl text-lg">
                            Full-stack engineer and product designer passionate about Web3 and AI.
                            Currently building modular protocols for the internet builder network.
                            Available for high-stakes projects and startup collaborations.
                        </p>
                    </section>

                    {/* Role specific content tabs */}
                    <section>
                        <div className="flex gap-8 border-b border-white/5 mb-10">
                            <button className="pb-4 text-sm font-bold border-b-2 border-primary text-white">Portfolio</button>
                            <button className="pb-4 text-sm font-bold text-white/40 hover:text-white transition-colors">Services</button>
                            <button className="pb-4 text-sm font-bold text-white/40 hover:text-white transition-colors">Startups</button>
                            <button className="pb-4 text-sm font-bold text-white/40 hover:text-white transition-colors">Reviews</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="glass group rounded-3xl p-8 border border-white/5 hover:border-primary/50 cursor-pointer overflow-hidden transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                                            <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-primary" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase">Project</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">OmniChain Protocol</h3>
                                    <p className="text-white/40 text-sm">A cross-chain liquidity aggregator built with zero-knowledge proofs.</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
