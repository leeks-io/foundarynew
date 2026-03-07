import { TrendingUp, Users, ArrowRight } from 'lucide-react'

interface StartupCardProps {
    name: string
    revenue: number
    users: number
    price: number
}

export default function StartupCard({ name, revenue, users, price }: StartupCardProps) {
    return (
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xl group-hover:text-primary transition-colors">
                        {name.charAt(0)}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wider">
                        For Sale
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
                <p className="text-white/40 text-sm mb-8 line-clamp-2">High-growth digital product with verified revenue and active user base.</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase mb-1">
                            <TrendingUp className="w-3 h-3" />
                            MRR
                        </div>
                        <div className="text-lg font-bold text-white">${revenue.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase mb-1">
                            <Users className="w-3 h-3" />
                            Users
                        </div>
                        <div className="text-lg font-bold text-white">{users.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Asking Price</div>
                    <div className="text-xl font-bold text-accent">${price.toLocaleString()}</div>
                </div>
                <button className="p-3 rounded-full bg-white/5 hover:bg-primary transition-all group-hover:glow-primary">
                    <ArrowRight className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    )
}
