import { Star, Clock, User } from 'lucide-react'

interface ServiceCardProps {
    title: string
    provider: string
    price: number
    rating: number
    deliveryTime: number
    image?: string
}

export default function ServiceCard({ title, provider, price, rating, deliveryTime }: ServiceCardProps) {
    return (
        <div className="glass rounded-3xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all group cursor-pointer">
            <div className="aspect-video bg-white/5 relative overflow-hidden">
                {/* Placeholder for service image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/20" />
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-white/60" />
                    </div>
                    <span className="text-xs font-medium text-white/60">{provider}</span>
                </div>

                <h3 className="font-semibold text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{deliveryTime}d</span>
                    </div>
                    <div className="text-sm font-bold text-accent">
                        {price} <span className="text-[10px] text-white/40 uppercase">USDC</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { Sparkles } from 'lucide-react'
