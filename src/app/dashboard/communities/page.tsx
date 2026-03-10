'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { CommunityWithCreator } from '@/types/database'
import { Search, Plus, Users, Loader2, X } from 'lucide-react'

export default function CommunitiesPage() {
    const supabase = createSupabaseBrowserClient()
    const [communities, setCommunities] = useState<CommunityWithCreator[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showCreate, setShowCreate] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [joined, setJoined] = useState<Set<string>>(new Set())
    const [busy, setBusy] = useState<Set<string>>(new Set())

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setUserId(session.user.id)
                const { data } = await supabase.from('community_members').select('community_id').eq('user_id', session.user.id)
                setJoined(new Set(data?.map((m: any) => m.community_id) ?? []))
            }
        }
        init()
    }, [])

    const load = useCallback(async () => {
        setLoading(true)
        let q = supabase.from('communities').select('*, profiles(id, full_name, avatar_url)').eq('is_public', true).order('member_count', { ascending: false }).limit(48)
        if (search.trim()) q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
        const { data } = await q
        setCommunities((data as CommunityWithCreator[]) ?? [])
        setLoading(false)
    }, [search])

    useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

    const toggleJoin = async (id: string, currentCount: number) => {
        if (!userId || busy.has(id)) return
        const isJoined = joined.has(id)
        setBusy(prev => new Set(prev).add(id))
        if (isJoined) {
            await supabase.from('community_members').delete().match({ community_id: id, user_id: userId })
            await supabase.from('communities').update({ member_count: Math.max(0, currentCount - 1) }).eq('id', id)
            setJoined(prev => { const s = new Set(prev); s.delete(id); return s })
            setCommunities(prev => prev.map(c => c.id === id ? { ...c, member_count: Math.max(0, c.member_count - 1) } : c))
        } else {
            await supabase.from('community_members').insert({ community_id: id, user_id: userId })
            await supabase.from('communities').update({ member_count: currentCount + 1 }).eq('id', id)
            setJoined(prev => new Set(prev).add(id))
            setCommunities(prev => prev.map(c => c.id === id ? { ...c, member_count: c.member_count + 1 } : c))
        }
        setBusy(prev => { const s = new Set(prev); s.delete(id); return s })
    }

    return (
        <div className="min-h-full bg-zinc-900">
            <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-white">Communities</h1>
                            <p className="text-xs sm:text-sm text-zinc-500">Find your tribe</p>
                        </div>
                        {userId && <button onClick={() => setShowCreate(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Create</span></button>}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities…" className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-36 bg-zinc-800/50 rounded-2xl animate-pulse" />)}
                    </div>
                ) : communities.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No communities yet</p>
                        {userId && <button onClick={() => setShowCreate(true)} className="mt-4 px-4 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">Create the first one</button>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {communities.map(c => (
                            <div key={c.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 space-y-3 hover:border-zinc-600/80 transition-colors">
                                <div className="flex items-start gap-3">
                                    {(c as any).avatar_url ? <img src={(c as any).avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" /> : <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-zinc-500" /></div>}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-white font-medium text-sm truncate">{c.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-zinc-500 text-xs">{c.member_count ?? 0} members</span>
                                            {(c as any).category && <><span className="text-zinc-700 text-xs">·</span><span className="text-zinc-500 text-xs">{(c as any).category}</span></>}
                                        </div>
                                    </div>
                                </div>
                                {c.description && <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{c.description}</p>}
                                {userId && (
                                    <button
                                        onClick={() => toggleJoin(c.id, c.member_count ?? 0)}
                                        disabled={busy.has(c.id)}
                                        className={`w-full py-2 rounded-xl text-xs font-medium transition-colors disabled:opacity-60 ${joined.has(c.id) ? 'bg-zinc-700 text-zinc-400 hover:bg-red-900/30 hover:text-red-400' : 'bg-white text-black hover:bg-zinc-200'}`}
                                    >
                                        {busy.has(c.id) ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : joined.has(c.id) ? 'Joined ✓' : 'Join'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreate && userId && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
                    <div className="relative z-10 w-full sm:max-w-md bg-zinc-900 border border-zinc-700/80 rounded-t-2xl sm:rounded-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                            <h2 className="text-white font-semibold">Create Community</h2>
                            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <CreateCommunityForm userId={userId} onSaved={() => { setShowCreate(false); load() }} />
                    </div>
                </div>
            )}
        </div>
    )
}

function CreateCommunityForm({ userId, onSaved }: { userId: string; onSaved: () => void }) {
    const supabase = createSupabaseBrowserClient()
    const [f, setF] = useState({ name: '', description: '', category: '' })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')

    const save = async () => {
        if (!f.name.trim()) { setErr('Name is required'); return }
        setSaving(true)
        const { data, error } = await supabase.from('communities').insert({ creator_id: userId, name: f.name.trim(), description: f.description || null, category: f.category || null }).select().single()
        if (error) { setErr(error.message); setSaving(false); return }
        await supabase.from('community_members').insert({ community_id: data.id, user_id: userId, role: 'admin' })
        onSaved()
    }

    return (
        <div className="p-5 space-y-4">
            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
            {[{ k: 'name', l: 'Name *', p: 'Indie Hackers Lagos' }, { k: 'category', l: 'Category', p: 'Tech, Design, Business…' }].map(({ k, l, p }) => (
                <div key={k}><label className="block text-xs font-medium text-zinc-400 mb-1">{l}</label><input value={(f as any)[k]} onChange={e => setF(prev => ({ ...prev, [k]: e.target.value }))} placeholder={p} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></div>
            ))}
            <div><label className="block text-xs font-medium text-zinc-400 mb-1">Description</label><textarea rows={3} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} placeholder="What's this community about?" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none resize-none" /></div>
            <button onClick={save} disabled={saving} className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">{saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Community'}</button>
        </div>
    )
}
