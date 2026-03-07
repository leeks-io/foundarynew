'use client'

import { useRole, UserRole } from '@/context/RoleContext'
import { Briefcase, Code, Rocket, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
    const { setRole } = useRole()
    const router = useRouter()

    const handleRoleSelect = (role: UserRole) => {
        setRole(role)
        router.push('/dashboard')
    }

    const roles = [
        {
            id: 'jobseeker' as UserRole,
            title: 'Job Seeker',
            description: 'Find your next big role in the internet builder ecosystem.',
            icon: Briefcase,
            color: 'bg-primary'
        },
        {
            id: 'freelancer' as UserRole,
            title: 'Freelancer',
            description: 'Sell digital services and build your on-chain reputation.',
            icon: Code,
            color: 'bg-accent'
        },
        {
            id: 'founder' as UserRole,
            title: 'Founder',
            description: 'Hire talent, build teams, and list startups for sale.',
            icon: Rocket,
            color: 'bg-primary'
        }
    ]

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-[#0B0F19]">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">How do you want to use Foundry?</h1>
                <p className="text-white/40">Choose the role that best fits your goals. You can switch anytime in settings.</p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className="glass rounded-[2rem] p-8 border border-white/5 hover:border-primary/50 transition-all group cursor-pointer flex flex-col items-center text-center"
                    >
                        <div className={`w-16 h-16 rounded-2xl ${role.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform glow-primary`}>
                            <role.icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
                        <p className="text-white/40 text-sm mb-10 leading-relaxed">{role.description}</p>

                        <div className="mt-auto flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all">
                            Select Role
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
