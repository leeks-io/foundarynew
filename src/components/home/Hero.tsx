import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute top-40 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -z-10" />

            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent mb-8 animate-fade-in">
                    <Sparkles className="w-3 h-3" />
                    <span>The Marketplace for Internet Builders</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                    The Marketplace for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        Internet Builders
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Foundry brings founders, freelancers, and job seekers together so you can
                    stop juggling platforms and start building faster.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg glow-primary hover:bg-primary/90 transition-all flex items-center gap-2 group">
                        Explore Marketplace
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 bg-white/5 text-white rounded-full font-bold text-lg border border-white/10 hover:bg-white/10 transition-all">
                        Join Foundry
                    </button>
                </div>

                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {['Jobs', 'Services', 'Startups', 'Communities'].map((cat) => (
                        <div
                            key={cat}
                            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group"
                        >
                            <div className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{cat}</div>
                            <div className="text-xs text-white/40 italic">Browse All &rarr;</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
