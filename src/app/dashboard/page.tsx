'use client'

import { useRole } from '@/context/RoleContext'
import { TrendingUp, Users, Briefcase, Rocket, Star, ArrowUpRight } from 'lucide-react'

export default function DashboardPage() {
    const { role } = useRole()

    const stats = {
        jobseeker: [
            { label: 'Applications Sent', value: '12', icon: Briefcase, color: 'text-primary' },
            { label: 'Interviews', value: '3', icon: Users, color: 'text-accent' },
            { label: 'Saved Jobs', value: '28', icon: Rocket, color: 'text-primary' },
        ],
        freelancer: [
            { label: 'Active Orders', value: '5', icon: Rocket, color: 'text-primary' },
            { label: 'Earnings', value: '2,450 USDC', icon: TrendingUp, color: 'text-accent' },
            { label: 'Avg Rating', value: '5.0', icon: Star, color: 'text-primary' },
        ],
        founder: [
            { label: 'Active Jobs', value: '4', icon: Briefcase, color: 'text-primary' },
            { label: 'Team Members', value: '18', icon: Users, color: 'text-accent' },
            { label: 'Startup Value', value: '450K', icon: TrendingUp, color: 'text-primary' },
        ]
    }

    const currentStats = stats[role]

    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 capitalize">{role} Dashboard</h1>
                    <p className="text-white/40">Welcome back, JD. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-accent px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    SYSTEM LIVE
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentStats.map((stat) => (
                    <div key={stat.label} className="glass rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <button className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-3xl font-black mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-white/40">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass rounded-[2.5rem] p-10 border border-white/5">
                    <h2 className="text-xl font-bold mb-8">Recent Activity</h2>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <div>
                                    <div className="text-sm font-bold">New {role === 'founder' ? 'application' : 'message'} received</div>
                                    <div className="text-xs text-white/40">2 hours ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-10 border border-white/5 flex items-center justify-center">
                    <div className="text-center">
                        <Rocket className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 text-sm font-medium">Analytics module loading...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
