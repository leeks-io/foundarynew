import Hero from "@/components/home/Hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Visual Break / Strategy Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
              One Hub. <br />
              <span className="text-primary">Infinite</span> Builds.
            </h2>
            <p className="text-lg text-white/50 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              Foundry isn't just a marketplace. It's an operating system for builders.
              Switch between workspaces to manage your career, your agency, or your startup portfolio—all with a single identity.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">Verified Identity</div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">Escrow Protected</div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">Solana Native</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 group-hover:bg-primary/30 transition-all" />
            <div className="glass rounded-[3rem] aspect-square lg:aspect-video border border-white/5 relative overflow-hidden flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6 glow-primary">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <div className="text-sm font-black italic uppercase tracking-[0.3em] mb-2">Syncing Workspace</div>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Awaiting Builder Authentication</div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div className="absolute bottom-8 right-8 w-12 h-1 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-3xl mx-auto glass p-16 rounded-[4rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 relative z-10">
            Ready to <span className="text-accent underline decoration-accent/30 underline-offset-8">Forge?</span>
          </h2>
          <p className="text-white/40 mb-10 font-medium relative z-10">Join 15,000+ builders already building the future on Foundry.</p>
          <button className="px-12 py-5 bg-white text-[#0B0F19] rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-2xl relative z-10">
            Start Building
          </button>
        </div>
      </section>
    </main>
  )
}



