import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
            {/* Overlay gradient for text readability */}
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#0B0F19]/20 via-transparent to-[#0B0F19]/90 -z-10" />

            <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-10 animate-fade-in shadow-2xl">
                    <Sparkles className="w-3 h-3" />
                    <span>The Marketplace for Internet Builders</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9] text-white">
                    Built by <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">
                        Builders
                    </span>
                </h1>

                <p className="text-base md:text-lg text-white/50 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                    Foundry is the home for internet builders. Collaborate, hire, build startups,
                    and trade digital services in one unified ecosystem.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black italic uppercase tracking-widest glow-primary hover:scale-[1.02] transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 group">
                        Explore Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white rounded-2xl font-black italic uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center">
                        Join Foundry
                    </button>
                </div>

                <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {[
                        { name: 'Jobs', desc: 'Hire Talent' },
                        { name: 'Services', desc: 'Best Escrow' },
                        { name: 'Startups', desc: 'Buy & Sell' },
                        { name: 'Blueprints', desc: 'Build Ideas' }
                    ].map((cat) => (
                        <div
                            key={cat.name}
                            className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-lg font-black italic uppercase mb-1 transition-colors group-hover:text-primary">{cat.name}</div>
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{cat.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
