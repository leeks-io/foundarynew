'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Shield, Lock, Bell, Sparkles,
    ChevronRight, CheckCircle2, Zap, ArrowRight,
    Monitor, CreditCard, Info, Globe, Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account')

    const menuItems = [
        { id: 'account', label: 'Your Account', icon: <User size={20} />, desc: 'See information about your account.' },
        { id: 'security', label: 'Security & Access', icon: <Shield size={20} />, desc: 'Manage your security settings.' },
        { id: 'privacy', label: 'Privacy & Safety', icon: <Lock size={20} />, desc: 'Manage what info you share.' },
        { id: 'premium', label: 'Premium', icon: <Sparkles size={20} className="text-[#07da63]" />, desc: 'Manage your subscription.', isPremium: true },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, desc: 'Select your preferences.' },
        { id: 'display', label: 'Display', icon: <Palette size={20} />, desc: 'Manage your theme & font.' },
    ]

    return (
        <div className="flex h-full min-h-screen">
            {/* Left Menu (380px) */}
            <div className="w-[380px] border-r border-[#1a1a1a] flex flex-col pt-4">
                <h2 className="px-4 text-xl font-bold mb-6">Settings</h2>
                <div className="flex-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full px-4 py-4 flex items-center justify-between hover:bg-[#080808] transition-colors group",
                                activeTab === item.id ? "bg-[#080808] border-r-2 border-[#07da63]" : ""
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("text-[#6b7280] group-hover:text-white transition-colors", activeTab === item.id ? "text-white" : "")}>
                                    {item.icon}
                                </div>
                                <div className="text-left">
                                    <p className={cn("text-[15px] font-bold leading-tight", activeTab === item.id ? "text-white" : "text-[#6b7280]")}>{item.label}</p>
                                    <p className="text-[11px] text-[#6b7280] font-medium leading-tight mt-1">{item.desc}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-[#6b7280]" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar max-w-2xl">
                <AnimatePresence mode="wait">
                    {activeTab === 'account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Account information</h3>
                                <p className="text-[#6b7280] text-sm font-medium">Update your account detailes and profile visibility.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1 mb-2 block">Username</label>
                                    <input type="text" defaultValue="@davidbuilds" className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none" />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1 mb-2 block">Email</label>
                                    <input type="email" defaultValue="david@foundry.io" className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none" />
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-[#6b7280] uppercase tracking-widest ml-1 mb-2 block">Location</label>
                                    <input type="text" defaultValue="San Francisco, CA" className="w-full bg-black border border-[#1a1a1a] rounded-xl px-5 py-3 text-white focus:border-[#07da63] focus:outline-none" />
                                </div>
                            </div>

                            <button className="bg-[#07da63] text-black font-bold px-8 py-3 rounded-full hover:bg-[#08f26e] transition-colors">
                                Save Changes
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'premium' && (
                        <motion.div
                            key="premium"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="bg-gradient-to-br from-[#07da63]/20 to-transparent border border-[#07da63]/30 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-[#07da63]/10 rounded-3xl flex items-center justify-center text-[#07da63] mb-6 animate-float shadow-[0_0_30px_#07da6320]">
                                        <Sparkles size={40} className="fill-current" />
                                    </div>
                                    <h2 className="text-4xl font-bold mb-3 tracking-tight">Foundry Premium</h2>
                                    <p className="text-[#6b7280] max-w-sm font-medium mb-8">
                                        Everything you need to build, scale, and monetize your internet presence.
                                    </p>
                                    <div className="bg-black/40 border border-[#1a1a1a] p-6 rounded-3xl w-full max-w-sm mb-8 text-left space-y-4">
                                        <PremiumFeature label="Unlimited job applications" />
                                        <PremiumFeature label="Unlimited service listings" />
                                        <PremiumFeature label="Access to Startup Marketplace" />
                                        <PremiumFeature label="Priority in builder search" />
                                        <PremiumFeature label="Verification badge (Green check)" />
                                    </div>

                                    <div className="w-full max-w-sm space-y-3">
                                        <button className="w-full bg-[#07da63] text-black font-bold h-14 rounded-full text-lg hover:bg-[#08f26e] transition-all shadow-[0_0_20px_#07da6340]">
                                            Subscribe for $5 / mo
                                        </button>
                                        <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">Pay with USDC or Solana</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl flex items-start gap-4">
                                <Info size={24} className="text-[#6b7280] shrink-0" />
                                <p className="text-sm text-[#6b7280] font-medium leading-relaxed">
                                    Subscriptions are billed monthly and can be cancelled at any time through your dashboard. All payments are processed on-chain for maximum transparency.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== 'account' && activeTab !== 'premium' && (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex h-full flex-col items-center justify-center text-center opacity-40 pt-20"
                        >
                            <Monitor size={64} className="mb-4" />
                            <h3 className="text-xl font-bold">{menuItems.find(m => m.id === activeTab)?.label} Settings</h3>
                            <p className="text-sm">This section is coming soon.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function PremiumFeature({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#07da63]/10 rounded-full flex items-center justify-center text-[#07da63] shrink-0">
                <CheckCircle2 size={12} />
            </div>
            <span className="text-[14px] font-bold text-white/90">{label}</span>
        </div>
    )
}
