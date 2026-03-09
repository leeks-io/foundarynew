"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export function useMessages(otherUserId: string) {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const supabase = createClient()
    const channelRef = useRef<any>(null)

    const query = useQuery({
        queryKey: ['messages', user?.id, otherUserId],
        queryFn: async () => {
            const { data } = await supabase
                .from('messages')
                .select(`*, sender:sender_id(username, profiles(profile_image))`)
                .or(
                    `and(sender_id.eq.${user!.id},receiver_id.eq.${otherUserId}),` +
                    `and(sender_id.eq.${otherUserId},receiver_id.eq.${user!.id})`
                )
                .order('created_at', { ascending: true })
            return data
        },
        enabled: !!user && !!otherUserId,
    })

    useEffect(() => {
        if (!user || !otherUserId) return
        channelRef.current = supabase
            .channel(`messages-${user.id}-${otherUserId}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'messages',
            }, (payload) => {
                // If the message is part of this convo, refresh
                const msg = payload.new
                if ((msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
                    (msg.sender_id === otherUserId && msg.receiver_id === user.id)) {
                    queryClient.invalidateQueries({ queryKey: ['messages', user.id, otherUserId] })
                }
            })
            .subscribe()

        return () => { supabase.removeChannel(channelRef.current) }
    }, [user, otherUserId, queryClient, supabase])

    return query
}

export function useSendMessage() {
    const supabase = createClient()
    const { user } = useAuth()

    return async (receiverId: string, content: string) => {
        if (!user) throw new Error("Not authenticated")
        const { data, error } = await supabase.from('messages').insert({
            sender_id: user.id,
            receiver_id: receiverId,
            content
        }).select().single()
        if (error) throw error
        return data
    }
} export function useConversations() {
    const { user } = useAuth()
    const supabase = createClient()
    return useQuery({
        queryKey: ['conversations', user?.id],
        queryFn: async () => {
            // Group by other user's ID and get last message
            const { data } = await supabase
                .from('messages')
                .select(`*, sender:sender_id(username, profiles(profile_image)), receiver:receiver_id(username, profiles(profile_image))`)
                .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
                .order('created_at', { ascending: false })

            // Logic to unique by other user
            const conversationsMap = new Map()
            data?.forEach(msg => {
                const otherUser = msg.sender_id === user!.id ? msg.receiver : msg.sender
                if (!conversationsMap.has(otherUser.id)) {
                    conversationsMap.set(otherUser.id, {
                        ...otherUser,
                        lastMsg: msg.content,
                        time: msg.created_at,
                        unread: !msg.is_read && msg.receiver_id === user!.id
                    })
                }
            })
            return Array.from(conversationsMap.values())
        },
        enabled: !!user
    })
}
