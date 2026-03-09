"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { fetchFeed } from '@/lib/queries/feed'
import { useAuth } from '@/hooks/useAuth'

export function useFeed() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const supabase = createSupabaseBrowserClient()

    const query = useQuery({
        queryKey: ['feed', user?.id],
        queryFn: () => fetchFeed(user!.id),
        enabled: !!user,
    })

    useEffect(() => {
        if (!user) return
        const channel = supabase
            .channel('feed-realtime')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'posts'
            }, (payload: any) => {
                // Optimistically update the feed cache with the new post
                // We'd ideally fetch the user data for the payload here if it's missing, 
                // or ensure the payload has it.
                queryClient.invalidateQueries({ queryKey: ['feed', user.id] })
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, queryClient, supabase])

    return query
}
