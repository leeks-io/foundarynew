"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export function useAuth() {
    const supabase = createClient()
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            setSession(s)
            setLoading(false)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
            setSession(s)
            setLoading(false)
        })
        return () => subscription.unsubscribe()
    }, [supabase])

    const { data: user, isLoading: profileLoading } = useQuery({
        queryKey: ['user', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) return null
            const { data } = await supabase
                .from('users')
                .select('*, profiles(*)')
                .eq('id', session.user.id)
                .single()
            return data
        },
        enabled: !!session?.user?.id
    })

    return { user, loading: loading || profileLoading, isAuthenticated: !!session }
}
