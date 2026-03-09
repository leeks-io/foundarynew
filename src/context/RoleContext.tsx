'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export type UserRole = 'jobseeker' | 'freelancer' | 'founder'

interface RoleContextType {
    role: UserRole
    setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
    const [role, setRoleState] = useState<UserRole>('jobseeker')
    const supabase = createClient()

    useEffect(() => {
        const fetchRole = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (data?.role) {
                    setRoleState(data.role as UserRole)
                }
            }
        }
        fetchRole()
    }, [supabase])

    const setRole = async (newRole: UserRole) => {
        setRoleState(newRole)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase
                .from('users')
                .update({ role: newRole })
                .eq('id', user.id)
        }
    }

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    )
}

export function useRole() {
    const context = useContext(RoleContext)
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider')
    }
    return context
}
