'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Notification } from '@/types/database'
import { Bell, Loader2, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsPage() {
    const supabase = createSupabaseBrowserClient()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return
            setUserId(session.user.id)
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(50)
            setNotifications(data ?? [])
            setLoading(false)
        }
        load()
    }, [])

    const markAllRead = async () => {
        if (!userId) return
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false)
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }

    const markRead = async (id: string) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    return (
        <div className="min-h-full bg-zinc-900">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-zinc-400">{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20">
                        <Bell className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => !n.is_read && markRead(n.id)}
                                className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.is_read ? 'bg-transparent hover:bg-zinc-800/30' : 'bg-zinc-800/60 hover:bg-zinc-800'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-white'}`} />
                                <div className="min-w-0 flex-1">
                                    <p className={`text-sm font-medium ${n.is_read ? 'text-zinc-400' : 'text-white'}`}>
                                        {n.title}
                                    </p>
                                    {n.body && (
                                        <p className="text-zinc-500 text-xs mt-0.5">{n.body}</p>
                                    )}
                                    <p className="text-zinc-600 text-xs mt-1">
                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
