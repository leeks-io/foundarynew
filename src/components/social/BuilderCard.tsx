import { CheckCircle2, Trophy, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BuilderCardProps {
    name: string
    role: string
    score: number
    isPremium?: boolean
}

export default function BuilderCard({ name, role, score, isPremium }: BuilderCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ border: '1px solid #07da6330' }}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 transition-all duration-300 flex flex-col items-center text-center h-full group"
        >
            <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full border-2 border-[#1a1a1a] p-1 group-hover:border-[#07da63] transition-all overflow-hidden bg-black">
                    <img
                        src={`https://i.pravatar.cc/150?u=${name}`}
                        alt={name}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                {isPremium && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#07da63] rounded-lg border-2 border-black">
                        <CheckCircle2 size={12} className="text-black fill-current" />
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-[#07da63] transition-colors">{name}</h3>
                    {isPremium && <Sparkles size={14} className="text-[#07da63]" />}
                </div>
                <p className="text-[#6b7280] text-xs font-bold mb-4 uppercase tracking-widest leading-none">{role}</p>

                <div className="mt-auto">
                    <div className="bg-black px-4 py-2 rounded-xl border border-[#1a1a1a] inline-flex items-center gap-2 mb-4">
                        <Trophy size={14} className="text-[#07da63]" />
                        <span className="font-bold text-sm text-[#07da63]">{score} <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest ml-1">Score</span></span>
                    </div>

                    <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
                        View Profile
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
