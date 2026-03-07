'use client'

import { useRole } from '@/context/RoleContext'
import { Search, MapPin, DollarSign, Calendar, ArrowUpRight } from 'lucide-react'

export default function JobsMarketplace() {
    const { role } = useRole()

    const jobs = [
        { id: 1, title: 'Lead Frontend Engineer', type: 'Full-time', budget: '120K - 160K', location: 'Remote', company: 'Nexus AI' },
        { id: 2, title: 'Smart Contract Auditor', type: 'Contract', budget: '5,000 USDC', location: 'Remote', company: 'EtherGuard' },
        { id: 3, title: 'Growth Marketer', type: 'Full-time', budget: '80K + Equity', location: 'New York / Hybrid', company: 'Foundry Labs' },
    ]

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-3 italic uppercase tracking-tighter">Jobs Marketplace</h1>
                    <p className="text-white/40 text-lg">Find your next big project or hire elite internet builders.</p>
                </div>

                {role === 'founder' && (
                    <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black italic uppercase tracking-widest glow-primary hover:scale-[1.02] transition-all active:scale-95 shadow-2xl">
                        Post a Job
                    </button>
                )}
            </div>

            <div className="glass p-4 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search roles, skills, or companies..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 font-medium outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <button className="px-10 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm">
                    Filters
                </button>
            </div>

            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="glass group rounded-3xl p-8 border border-white/5 hover:border-primary/50 transition-all cursor-pointer">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-2xl group-hover:bg-primary/10 transition-colors">
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Rocket className="w-4 h-4" />
                                            {job.company}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {job.type}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                                <div className="text-right">
                                    <div className="text-xs font-bold text-white/40 uppercase mb-1">Budget</div>
                                    <div className="text-xl font-black text-accent">{job.budget}</div>
                                </div>
                                <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-primary hover:border-primary transition-all flex items-center gap-2">
                                    {role === 'founder' ? 'Edit Post' : 'Apply Now'}
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

import { Rocket } from 'lucide-react'
