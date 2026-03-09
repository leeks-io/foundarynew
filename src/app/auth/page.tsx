'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function AuthPage({ searchParams }: { searchParams: { mode?: string } }) {
    const [view, setView] = useState<'login' | 'signup'>(searchParams.mode === 'signup' ? 'signup' : 'login')
    const [role, setRole] = useState<'talent' | 'freelancer' | 'founder'>('freelancer')

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
            {/* Subtle vignette background */}
            <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[420px] bg-black border border-[#1a1a1a] rounded-2xl p-8 relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <span className="text-[#07da63] text-4xl font-bold">⬡</span>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'login' ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-8">Sign in to Foundry</h1>

                            <div className="space-y-4">
                                <button className="w-full bg-white text-black font-bold h-11 rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <button className="w-full bg-black border border-[#1a1a1a] text-white font-bold h-11 rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                                    <span className="text-[#07da63]">🔗</span> Connect Wallet
                                </button>

                                <div className="flex items-center gap-4 py-2">
                                    <div className="h-px bg-[#1a1a1a] flex-1" />
                                    <span className="text-[#6b7280] text-sm">or</span>
                                    <div className="h-px bg-[#1a1a1a] flex-1" />
                                </div>

                                <div className="space-y-4">
                                    <div className="group">
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className="w-full h-11 bg-black border border-[#1a1a1a] rounded-lg px-4 text-white focus:border-[#07da63] focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="group">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full h-11 bg-black border border-[#1a1a1a] rounded-lg px-4 text-white focus:border-[#07da63] focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <button className="w-full bg-[#07da63] text-black font-bold h-11 rounded-full mt-4 hover:bg-[#08f26e] transition-colors">
                                    Next
                                </button>

                                <p className="text-[#6b7280] text-xs mt-4">
                                    Forgot password?
                                </p>

                                <p className="text-[#6b7280] text-[15px] mt-10">
                                    Don't have an account? <button onClick={() => setView('signup')} className="text-[#07da63] hover:underline">Sign up</button>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-8">Create your account</h1>

                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <input type="text" placeholder="Full name" className="w-full h-11 bg-black border border-[#1a1a1a] rounded-lg px-4 text-white focus:border-[#07da63] focus:outline-none" />
                                    <input type="email" placeholder="Email" className="w-full h-11 bg-black border border-[#1a1a1a] rounded-lg px-4 text-white focus:border-[#07da63] focus:outline-none" />
                                    <input type="password" placeholder="Password" className="w-full h-11 bg-black border border-[#1a1a1a] rounded-lg px-4 text-white focus:border-[#07da63] focus:outline-none" />
                                </div>

                                <div className="pt-2">
                                    <p className="text-sm font-bold text-[#6b7280] mb-3">Select your role:</p>
                                    <div className="flex gap-2">
                                        <RoleChip label="🎯 Talent" active={role === 'talent'} onClick={() => setRole('talent')} />
                                        <RoleChip label="💼 Freelancer" active={role === 'freelancer'} onClick={() => setRole('freelancer')} />
                                        <RoleChip label="🚀 Founder" active={role === 'founder'} onClick={() => setRole('founder')} />
                                    </div>
                                </div>

                                <button className="w-full bg-[#07da63] text-black font-bold h-11 rounded-full mt-6 hover:bg-[#08f26e] transition-colors">
                                    Create Account
                                </button>

                                <p className="text-[#6b7280] text-[15px] mt-10">
                                    Already have an account? <button onClick={() => setView('login')} className="text-[#07da63] hover:underline">Sign in</button>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

function RoleChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                active
                    ? "bg-[#07da63]/10 border-[#07da63] text-[#07da63]"
                    : "border-[#1a1a1a] text-[#6b7280] hover:bg-white/5"
            )}
        >
            {label}
        </button>
    )
}
