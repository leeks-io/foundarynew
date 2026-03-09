"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export function useNotifications() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const supabase = createSupabaseBrowserClient()

    const query = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('notifications')
                .select("*")
                .eq("user_id", user!.id)
                .order('created_at', { ascending: false })
                .limit(50)
            return data
        },
        enabled: !!user
    })

    // Real-time new notifications
    useEffect(() => {
        if (!user) return
        const channel = supabase
            .channel(`notifs-${user.id}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, (payload: any) => {
                // Refresh notifications
                queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
                // Play notification sound
                new Audio('/sounds/notify.mp3').play().catch(() => { })
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, queryClient, supabase])

    const unreadCount = query.data?.filter((n: any) => !n.is_read).length ?? 0

    const markAsRead = async (id: string) => {
        if (!user) return
        await supabase.from('notifications').update({ is_read: true })
            .eq("id", id)
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
    }

    const markAllRead = async () => {
        if (!user) return
        await supabase.from('notifications').update({ is_read: true })
            .eq("user_id", user.id).eq("is_read", false)
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
    }

    return { ...query, unreadCount, markAsRead, markAllRead }
}
