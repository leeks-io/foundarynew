'use client'

import { TrendingUp, Users, ArrowRight, Rocket, DollarSign, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface StartupCardProps {
    name: string
    revenue: number
    users: number
    price: number
    industry?: string
    founded?: string
    logo?: string
}

export default function StartupCard({ name, revenue, users, price, industry = "SaaS · B2B", founded = "2023", logo }: StartupCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ border: '1px solid #07da6330' }}
            className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-[2rem] transition-all duration-300 flex flex-col h-full group"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-[#1a1a1a] flex items-center justify-center text-[#07da63] group-hover:scale-110 transition-transform">
                    {logo ? <img src={logo} alt={name} className="w-8 h-8 object-contain" /> : <Rocket size={24} />}
                </div>
                <div>
                    <h3 className="font-bold text-xl leading-tight group-hover:text-[#07da63] transition-colors">{name}</h3>
                    <p className="text-[#6b7280] text-xs font-bold uppercase tracking-widest mt-1">{industry}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/40 p-3 rounded-2xl border border-[#1a1a1a]">
                    <p className="text-[10px] text-[#6b7280] mb-1 font-bold uppercase tracking-widest leading-none">MRR</p>
                    <p className="font-bold text-lg text-white">${revenue.toLocaleString()}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-2xl border border-[#1a1a1a]">
                    <p className="text-[10px] text-[#6b7280] mb-1 font-bold uppercase tracking-widest leading-none">Users</p>
                    <p className="font-bold text-lg text-white">{users.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1a1a1a]">
                <div className="flex flex-col">
                    <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest mb-1">Asking Price</span>
                    <span className="text-xl font-bold text-[#07da63]">${price.toLocaleString()} <span className="text-xs text-[#6b7280]">USDC</span></span>
                </div>
                <button className="bg-[#07da63] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#08f26e] transition-colors flex items-center gap-2 group/btn">
                    View Startup <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}
