import { CheckCircle2, Trophy } from 'lucide-react'

interface BuilderCardProps {
    name: string
    role: string
    score: number
    isPremium?: boolean
}

export default function BuilderCard({ name, role, score, isPremium }: BuilderCardProps) {
    return (
        <div className="glass rounded-3xl p-6 border border-white/5 hover:border-accent/50 transition-all group cursor-pointer relative overflow-hidden">
            {isPremium && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold rounded-bl-xl border-l border-b border-accent/20">
                    PREMIUM
                </div>
            )}

            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center border border-white/5">
                        <span className="text-2xl font-bold text-white/20">{name.charAt(0)}</span>
                    </div>
                    {isPremium && (
                        <div className="absolute -bottom-1 -right-1 p-1 bg-accent rounded-full glow-accent">
                            <CheckCircle2 className="w-3 h-3 text-[#0B0F19]" />
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-white mb-1">{name}</h3>
                <p className="text-xs text-white/40 mb-4">{role}</p>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-semibold">
                    <Trophy className="w-3.5 h-3.5 text-accent" />
                    <span>Foundry Score: <span className="text-accent">{score}</span></span>
                </div>
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold hover:bg-white/10 transition-colors">
                Follow Builder
            </button>
        </div>
    )
}
