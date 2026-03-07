'use client'

import { useRole, UserRole } from '@/context/RoleContext'
import { LayoutGrid, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function WorkspaceSwitcher() {
    const { role, setRole } = useRole()

    const roles: { id: UserRole; name: string }[] = [
        { id: 'jobseeker', name: 'Talent' },
        { id: 'freelancer', name: 'Freelancer' },
        { id: 'founder', name: 'Founder' },
    ]

    return (
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
            {roles.map((r) => {
                const isActive = role === r.id
                return (
                    <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            isActive
                                ? "bg-primary text-white shadow-lg glow-primary"
                                : "text-white/40 hover:text-white"
                        )}
                    >
                        {isActive && <CheckCircle2 className="w-3 h-3" />}
                        {r.name}
                    </button>
                )
            })}
        </div>
    )
}
