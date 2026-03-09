'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, User, Zap, Rocket, Target, Briefcase, Camera, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState<'talent' | 'freelancer' | 'founder' | null>(null)

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-20 px-6">
            {/* Progress & Step Indicator */}
            <div className="w-full max-w-[560px] mb-12">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[#6b7280] text-sm font-medium">Step {step} of 2</span>
                    <span className="text-[#6b7280] text-sm font-medium">{step === 1 ? '50%' : '100%'}</span>
                </div>
                <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#07da63]"
                        initial={{ width: '0%' }}
                        animate={{ width: step === 1 ? '50%' : '100%' }}
                    />
                </div>
            </div>

            <div className="w-full max-w-[560px]">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="text-3xl font-bold mb-2">How do you want to use Foundry?</h1>
                            <p className="text-[#6b7280] mb-8">You can switch roles later in settings.</p>

                            <div className="space-y-4">
                                <SelectionCard
                                    id="talent"
                                    icon="🎯"
                                    title="Job Seeker / Talent"
                                    desc="Apply for jobs, showcase your resume, get hired."
                                    selected={role === 'talent'}
                                    onClick={() => setRole('talent')}
                                />
                                <SelectionCard
                                    id="freelancer"
                                    icon="💼"
                                    title="Freelancer / Contractor"
                                    desc="Sell your services, manage orders, earn in USDC."
                                    selected={role === 'freelancer'}
                                    onClick={() => setRole('freelancer')}
                                />
                                <SelectionCard
                                    id="founder"
                                    icon="🚀"
                                    title="Founder / Entrepreneur"
                                    desc="Post jobs, build teams, launch and sell startups."
                                    selected={role === 'founder'}
                                    onClick={() => setRole('founder')}
                                />
                            </div>

                            <button
                                disabled={!role}
                                onClick={() => setStep(2)}
                                className="w-full mt-10 bg-[#07da63] text-black font-bold h-12 rounded-full flex items-center justify-center gap-2 hover:bg-[#08f26e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="text-3xl font-bold mb-8">Set up your builder profile</h1>

                            <div className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border border-[#1a1a1a] flex items-center justify-center cursor-pointer group hover:border-[#07da63]/50 transition-colors">
                                        <Camera size={24} className="text-[#6b7280] group-hover:text-[#07da63]" />
                                    </div>
                                    <button className="text-[#07da63] text-sm font-bold">Upload photo</button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#6b7280] ml-1">Username</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">@</span>
                                            <input type="text" placeholder="handle" className="w-full h-11 bg-black border border-[#1a1a1a] rounded-lg pl-8 pr-4 text-white focus:border-[#07da63] focus:outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#6b7280] ml-1">Bio</label>
                                        <textarea
                                            placeholder="What are you building?"
                                            maxLength={160}
                                            className="w-full h-32 bg-black border border-[#1a1a1a] rounded-lg p-4 text-white focus:border-[#07da63] focus:outline-none transition-colors resize-none"
                                        />
                                        <div className="text-right text-[10px] text-[#6b7280] font-bold">0 / 160</div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#6b7280] ml-1">Skills</label>
                                        <div className="flex flex-wrap gap-2 p-2 min-h-[44px] bg-black border border-[#1a1a1a] rounded-lg focus-within:border-[#07da63] transition-colors">
                                            <input type="text" placeholder="Type and press enter..." className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <Link href="/dashboard" className="w-full bg-[#07da63] text-black font-bold h-12 rounded-full flex items-center justify-center gap-2 hover:bg-[#08f26e] transition-colors">
                                        Finish Setup <ArrowRight size={20} />
                                    </Link>
                                    <Link href="/dashboard" className="block text-center text-[#6b7280] text-[15px] font-medium hover:underline">
                                        Skip for now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function SelectionCard({ id, icon, title, desc, selected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden group",
                selected
                    ? "border-[#07da63] bg-[#07da63]/5"
                    : "border-[#1a1a1a] bg-[#0d0d0d] hover:bg-[#111111] hover:border-[#1a1a1a]"
            )}
        >
            <div className="flex gap-4 items-start relative z-10">
                <span className="text-3xl">{icon}</span>
                <div>
                    <h3 className="font-bold text-lg mb-1">{title}</h3>
                    <p className="text-[#6b7280] text-[15px] leading-tight font-medium">{desc}</p>
                </div>
            </div>
            {selected && (
                <div className="absolute top-4 right-4 text-[#07da63]">
                    <CheckCircle2 size={24} />
                </div>
            )}
        </button>
    )
}
