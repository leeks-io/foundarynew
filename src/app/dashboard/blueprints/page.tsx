'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { Search, Plus, Loader2, X, BookOpen, ExternalLink, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Blueprint {
    id: string
    author_id: string
    title: string
    description: string | null
    content: string | null
    category: string | null
    tags: string[]
    is_premium: boolean
    price: number | null
    created_at: string
    profiles: { id: string; full_name: string | null; username: string | null; avatar_url: string | null; role: string | null }
}

const CATEGORIES = ['Business', 'Tech', 'Marketing', 'Finance', 'Design', 'Operations', 'HR', 'Legal', 'Other']

export default function BlueprintsPage() {
    const supabase = createSupabaseBrowserClient()
    const [blueprints, setBlueprints] = useState<Blueprint[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [showPost, setShowPost] = useState(false)
    const [detail, setDetail] = useState<Blueprint | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setUserId(session.user.id)
                const { data } = await supabase.from('profiles').select('is_premium').eq('id', session.user.id).single()
                setIsPremium(data?.is_premium ?? false)
            }
        }
        init()
    }, [])

    const load = useCallback(async () => {
        setLoading(true)
        let q = supabase.from('blueprints').select('*, profiles(id, full_name, username, avatar_url, role)').order('created_at', { ascending: false }).limit(48)
        if (category !== 'all') q = q.eq('category', category)
        if (search.trim()) q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        const { data } = await q
        setBlueprints((data as Blueprint[]) ?? [])
        setLoading(false)
    }, [category, search])

    useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

    return (
        <div className="min-h-full bg-zinc-900">
            <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-white">Blueprints</h1>
                            <p className="text-xs sm:text-sm text-zinc-500">Proven frameworks and templates</p>
                        </div>
                        {userId && <button onClick={() => setShowPost(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Share Blueprint</span></button>}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blueprints…" className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                        {['all', ...CATEGORIES].map(c => <button key={c} onClick={() => setCategory(c)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{c === 'all' ? 'All' : c}</button>)}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-zinc-800/50 rounded-2xl animate-pulse" />)}
                    </div>
                ) : blueprints.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No blueprints yet</p>
                        {userId && <button onClick={() => setShowPost(true)} className="mt-4 px-4 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">Share the first blueprint</button>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {blueprints.map(b => (
                            <button key={b.id} onClick={() => setDetail(b)} className="text-left bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 space-y-3 hover:border-zinc-600 transition-all w-full">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {b.profiles?.avatar_url ? <img src={b.profiles.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" /> : <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs text-zinc-300">{b.profiles?.full_name?.[0]}</div>}
                                        <span className="text-zinc-400 text-xs truncate">{b.profiles?.full_name || b.profiles?.username}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {b.is_premium && <Lock className="w-3.5 h-3.5 text-yellow-500" />}
                                        {b.category && <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded-full text-xs">{b.category}</span>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">{b.title}</h3>
                                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2 leading-relaxed">{b.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-zinc-600 text-xs">{formatDistanceToNow(new Date(b.created_at), { addSuffix: true })}</span>
                                    {b.price && b.price > 0 ? <span className="text-white font-semibold text-sm">${b.price}</span> : <span className="text-green-400 text-xs font-medium">Free</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {detail && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDetail(null)} />
                    <div className="relative z-10 w-full sm:max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                            <h2 className="text-white font-semibold truncate pr-4">{detail.title}</h2>
                            <button onClick={() => setDetail(null)} className="shrink-0 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                {detail.profiles?.avatar_url ? <img src={detail.profiles.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm text-zinc-300">{detail.profiles?.full_name?.[0]}</div>}
                                <div><p className="text-white text-sm font-medium">{detail.profiles?.full_name}</p><p className="text-zinc-500 text-xs capitalize">{detail.profiles?.role}</p></div>
                            </div>
                            {detail.description && <p className="text-zinc-300 text-sm leading-relaxed">{detail.description}</p>}
                            {detail.is_premium && !isPremium ? (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                    <Lock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                    <p className="text-yellow-400 text-sm font-medium">Premium Content</p>
                                    <p className="text-zinc-400 text-xs mt-1">Upgrade to access this blueprint</p>
                                </div>
                            ) : detail.content ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <pre className="bg-zinc-800 rounded-xl p-4 text-xs text-zinc-300 whitespace-pre-wrap overflow-x-auto">{detail.content}</pre>
                                </div>
                            ) : null}
                            {detail.tags?.length > 0 && <div className="flex flex-wrap gap-2">{detail.tags.map(t => <span key={t} className="px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs">{t}</span>)}</div>}
                        </div>
                    </div>
                </div>
            )}

            {showPost && userId && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPost(false)} />
                    <div className="relative z-10 w-full sm:max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                            <h2 className="text-white font-semibold">Share a Blueprint</h2>
                            <button onClick={() => setShowPost(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <PostBlueprintForm userId={userId} onSaved={() => { setShowPost(false); load() }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function PostBlueprintForm({ userId, onSaved }: { userId: string; onSaved: () => void }) {
    const supabase = createSupabaseBrowserClient()
    const [f, setF] = useState({ title: '', description: '', content: '', category: '', tags: '', price: '0' })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')
    const set = (k: string) => (e: React.ChangeEvent<any>) => setF(p => ({ ...p, [k]: e.target.value }))

    const save = async () => {
        if (!f.title.trim() || !f.content.trim()) { setErr('Title and content required'); return }
        setSaving(true)
        const { error } = await supabase.from('blueprints').insert({ author_id: userId, title: f.title.trim(), description: f.description || null, content: f.content.trim(), category: f.category || null, tags: f.tags ? f.tags.split(',').map(t => t.trim()).filter(Boolean) : [], price: Number(f.price) || 0, is_premium: Number(f.price) > 0 })
        if (error) { setErr(error.message); setSaving(false); return }
        onSaved()
    }

    return (
        <div className="p-5 space-y-4">
            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
            {[{ k: 'title', l: 'Title *', p: 'e.g. SaaS Pricing Strategy Framework' }, { k: 'tags', l: 'Tags (comma-separated)', p: 'pricing, saas, revenue' }].map(({ k, l, p }) => (
                <div key={k}><label className="block text-xs font-medium text-zinc-400 mb-1">{l}</label><input value={(f as any)[k]} onChange={set(k)} placeholder={p} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></div>
            ))}
            <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                    <select value={f.category} onChange={set('category')} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none">
                        <option value="">None</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div><label className="block text-xs font-medium text-zinc-400 mb-1">Price ($, 0 = free)</label><input type="number" min="0" value={f.price} onChange={set('price')} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-zinc-400 mb-1">Summary</label><textarea rows={2} value={f.description} onChange={set('description')} placeholder="Brief description…" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none resize-none" /></div>
            <div><label className="block text-xs font-medium text-zinc-400 mb-1">Content *</label><textarea rows={8} value={f.content} onChange={set('content')} placeholder="Paste your full blueprint here…" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none resize-none font-mono text-xs" /></div>
            <button onClick={save} disabled={saving} className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">{saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Publish Blueprint'}</button>
        </div>
    )
}
