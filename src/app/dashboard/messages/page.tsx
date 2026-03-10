'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { Send, MessageSquare, Loader2, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Convo {
    id: string
    participant_1: string
    participant_2: string
    last_message_at: string
    other: { id: string; full_name: string | null; username: string | null; avatar_url: string | null }
    preview?: string
}

interface Msg {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
}

function Avatar({ src, name }: { src?: string | null; name?: string | null }) {
    const init = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
    return src
        ? <img src={src} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
        : <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs font-medium text-zinc-300">{init}</div>
}

export default function MessagesPage() {
    const supabase = createSupabaseBrowserClient()
    const [userId, setUserId] = useState<string | null>(null)
    const [convos, setConvos] = useState<Convo[]>([])
    const [loadingConvos, setLoadingConvos] = useState(true)
    const [active, setActive] = useState<Convo | null>(null)
    const [msgs, setMsgs] = useState<Msg[]>([])
    const [loadingMsgs, setLoadingMsgs] = useState(false)
    const [draft, setDraft] = useState('')
    const [sending, setSending] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return
            setUserId(session.user.id)
            await loadConvos(session.user.id)
        }
        init()
    }, [])

    const loadConvos = async (uid: string) => {
        setLoadingConvos(true)
        const { data } = await supabase
            .from('conversations')
            .select('*')
            .or(`participant_1.eq.${uid},participant_2.eq.${uid}`)
            .order('last_message_at', { ascending: false })

        if (!data || data.length === 0) { setConvos([]); setLoadingConvos(false); return }

        const enriched = await Promise.all(data.map(async cv => {
            const otherId = cv.participant_1 === uid ? cv.participant_2 : cv.participant_1
            const [{ data: prof }, { data: last }] = await Promise.all([
                supabase.from('profiles').select('id, full_name, username, avatar_url').eq('id', otherId).single(),
                supabase.from('messages').select('content').eq('conversation_id', cv.id).order('created_at', { ascending: false }).limit(1).single(),
            ])
            return { ...cv, other: prof!, preview: last?.content }
        }))

        setConvos(enriched)
        setLoadingConvos(false)
    }

    const openConvo = async (cv: Convo) => {
        setActive(cv)
        setLoadingMsgs(true)
        setMsgs([])
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', cv.id)
            .order('created_at', { ascending: true })
        setMsgs((data as Msg[]) ?? [])
        setLoadingMsgs(false)
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
        if (userId) {
            await supabase.from('messages')
                .update({ is_read: true })
                .eq('conversation_id', cv.id)
                .neq('sender_id', userId)
        }
    }

    const send = async () => {
        if (!draft.trim() || !active || !userId || sending) return
        setSending(true)
        const { data } = await supabase.from('messages')
            .insert({ conversation_id: active.id, sender_id: userId, content: draft.trim() })
            .select()
            .single()
        if (data) {
            setMsgs(prev => [...prev, data as Msg])
            setDraft('')
            await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', active.id)
            setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        }
        setSending(false)
    }

    // Empty state — no conversations
    if (!loadingConvos && convos.length === 0 && !active) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center bg-zinc-900">
                <MessageSquare className="w-12 h-12 text-zinc-700 mb-4" />
                <p className="text-zinc-400 font-medium text-sm">No messages yet</p>
                <p className="text-zinc-600 text-xs mt-1 max-w-xs">
                    Go to Explore, connect with someone, and start a conversation.
                </p>
            </div>
        )
    }

    return (
        <div className="flex h-full bg-zinc-900 overflow-hidden">

            {/* Conversation list — hidden on mobile when chat is open */}
            <div className={`${active ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-72 lg:w-80 border-r border-zinc-800 shrink-0 bg-zinc-900`}>
                <div className="px-4 py-4 border-b border-zinc-800 shrink-0">
                    <h1 className="text-base font-semibold text-white">Messages</h1>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loadingConvos ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
                        </div>
                    ) : (
                        convos.map(cv => (
                            <button
                                key={cv.id}
                                onClick={() => openConvo(cv)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/60 hover:bg-zinc-800/60 transition-colors text-left ${active?.id === cv.id ? 'bg-zinc-800' : ''}`}
                            >
                                <Avatar src={cv.other?.avatar_url} name={cv.other?.full_name} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-white text-sm font-medium truncate">{cv.other?.full_name || cv.other?.username || 'User'}</p>
                                        <span className="text-zinc-600 text-xs shrink-0">{formatDistanceToNow(new Date(cv.last_message_at))}</span>
                                    </div>
                                    <p className="text-zinc-500 text-xs truncate mt-0.5">{cv.preview || 'No messages yet'}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat pane */}
            {active ? (
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-900">
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur shrink-0">
                        <button onClick={() => setActive(null)} className="md:hidden text-zinc-500 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <Avatar src={active.other?.avatar_url} name={active.other?.full_name} />
                        <p className="text-white font-medium text-sm truncate">{active.other?.full_name || active.other?.username}</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                        {loadingMsgs ? (
                            <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 text-zinc-600 animate-spin" /></div>
                        ) : msgs.length === 0 ? (
                            <p className="text-center text-zinc-600 text-sm py-10">Say hello 👋</p>
                        ) : (
                            msgs.map((m, i) => {
                                const mine = m.sender_id === userId
                                const showTime = i === 0 || new Date(m.created_at).getTime() - new Date(msgs[i - 1].created_at).getTime() > 5 * 60 * 1000
                                return (
                                    <div key={m.id}>
                                        {showTime && (
                                            <p className="text-center text-zinc-700 text-xs my-3">
                                                {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                                            </p>
                                        )}
                                        <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[78%] sm:max-w-sm px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${mine ? 'bg-white text-black rounded-br-sm' : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                                                }`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-zinc-800 shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                                placeholder="Type a message…"
                                className="flex-1 min-w-0 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                            />
                            <button
                                onClick={send}
                                disabled={!draft.trim() || sending}
                                className="shrink-0 p-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-40 transition-colors"
                            >
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Desktop placeholder when no convo selected */
                <div className="hidden md:flex flex-1 items-center justify-center bg-zinc-900">
                    <div className="text-center">
                        <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">Select a conversation</p>
                    </div>
                </div>
            )}
        </div>
    )
}
