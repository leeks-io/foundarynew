'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { StartupWithFounder } from '@/types/database'
import { Search, Plus, Loader2, X, Rocket, Globe, ExternalLink } from 'lucide-react'

const STAGES = ['idea', 'mvp', 'seed', 'series-a', 'growth'] as const
const STAGE_STYLE: Record<string, string> = {
    idea: 'bg-zinc-700/80 text-zinc-300',
    mvp: 'bg-blue-500/20 text-blue-400',
    seed: 'bg-green-500/20 text-green-400',
    'series-a': 'bg-purple-500/20 text-purple-400',
    growth: 'bg-orange-500/20 text-orange-400',
}

export default function StartupsPage() {
    const supabase = createSupabaseBrowserClient()
    const [startups, setStartups] = useState<StartupWithFounder[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [stage, setStage] = useState('all')
    const [showPost, setShowPost] = useState(false)
    const [detail, setDetail] = useState<StartupWithFounder | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user.id ?? null))
    }, [])

    const load = useCallback(async () => {
        setLoading(true)
        let q = supabase.from('startups').select('*, profiles(*)').eq('is_public', true).order('created_at', { ascending: false }).limit(48)
        if (stage !== 'all') q = q.eq('stage', stage)
        if (search.trim()) q = q.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`)
        const { data } = await q
        setStartups((data as StartupWithFounder[]) ?? [])
        setLoading(false)
    }, [stage, search])

    useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

    return (
        <div className="min-h-full bg-zinc-900">
            <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-white">Startups</h1>
                            <p className="text-xs sm:text-sm text-zinc-500">Discover what builders are creating</p>
                        </div>
                        {userId && <button onClick={() => setShowPost(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Startup</span></button>}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search startups…" className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                        {['all', ...STAGES].map(s => <button key={s} onClick={() => setStage(s)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${stage === s ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{s === 'all' ? 'All Stages' : s}</button>)}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-44 bg-zinc-800/50 rounded-2xl animate-pulse" />)}
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-20">
                        <Rocket className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No startups listed yet</p>
                        {userId && <button onClick={() => setShowPost(true)} className="mt-4 px-4 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">Be the first to list yours</button>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {startups.map(s => (
                            <button key={s.id} onClick={() => setDetail(s)} className="text-left bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 space-y-3 hover:border-zinc-600 transition-all w-full">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {s.logo_url ? <img src={s.logo_url} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" /> : <div className="w-9 h-9 rounded-xl bg-zinc-700 flex items-center justify-center shrink-0"><Rocket className="w-4 h-4 text-zinc-500" /></div>}
                                        <h3 className="text-white font-medium text-sm truncate">{s.name}</h3>
                                    </div>
                                    {s.stage && <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STAGE_STYLE[s.stage] ?? 'bg-zinc-700 text-zinc-400'}`}>{s.stage}</span>}
                                </div>
                                {s.tagline && <p className="text-zinc-300 text-sm line-clamp-1">{s.tagline}</p>}
                                {s.description && <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{s.description}</p>}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {s.profiles?.avatar_url ? <img src={s.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" /> : <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">{s.profiles?.full_name?.[0]}</div>}
                                        <span className="text-zinc-500 text-xs truncate max-w-[100px]">{s.profiles?.full_name}</span>
                                    </div>
                                    {s.industry && <span className="text-zinc-600 text-xs">{s.industry}</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {detail && (
                <ModalShell onClose={() => setDetail(null)} title={detail.name}>
                    <div className="p-5 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {detail.stage && <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STAGE_STYLE[detail.stage]}`}>{detail.stage}</span>}
                            {detail.industry && <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-400">{detail.industry}</span>}
                        </div>
                        {detail.tagline && <p className="text-zinc-200 font-medium">{detail.tagline}</p>}
                        {detail.description && <p className="text-zinc-400 text-sm leading-relaxed">{detail.description}</p>}
                        {detail.looking_for?.length > 0 && <div><p className="text-zinc-400 text-xs font-medium mb-2">Looking for</p><div className="flex flex-wrap gap-2">{detail.looking_for.map(l => <span key={l} className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">{l}</span>)}</div></div>}
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/60 rounded-xl">
                            {detail.profiles?.avatar_url ? <img src={detail.profiles.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm text-zinc-300">{detail.profiles?.full_name?.[0]}</div>}
                            <div><p className="text-white text-sm font-medium">{detail.profiles?.full_name}</p><p className="text-zinc-500 text-xs">Founder</p></div>
                        </div>
                        {detail.website && <a href={detail.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors break-all"><Globe className="w-4 h-4 shrink-0" /><span className="truncate">{detail.website}</span><ExternalLink className="w-3 h-3 shrink-0" /></a>}
                    </div>
                </ModalShell>
            )}

            {showPost && userId && (
                <ModalShell onClose={() => setShowPost(false)} title="List Your Startup">
                    <PostStartupForm userId={userId} onSaved={() => { setShowPost(false); load() }} />
                </ModalShell>
            )}
        </div>
    )
}

function ModalShell({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                    <h2 className="text-white font-semibold truncate pr-4">{title}</h2>
                    <button onClick={onClose} className="shrink-0 text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    )
}

function PostStartupForm({ userId, onSaved }: { userId: string; onSaved: () => void }) {
    const supabase = createSupabaseBrowserClient()
    const [f, setF] = useState({ name: '', tagline: '', description: '', website: '', stage: 'idea', industry: '', looking_for: '' })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')
    const set = (k: string) => (e: React.ChangeEvent<any>) => setF(p => ({ ...p, [k]: e.target.value }))

    const save = async () => {
        if (!f.name.trim()) { setErr('Startup name is required'); return }
        setSaving(true)
        const { error } = await supabase.from('startups').insert({ founder_id: userId, name: f.name.trim(), tagline: f.tagline || null, description: f.description || null, website: f.website || null, stage: f.stage as any, industry: f.industry || null, looking_for: f.looking_for ? f.looking_for.split(',').map(s => s.trim()).filter(Boolean) : [] })
        if (error) { setErr(error.message); setSaving(false); return }
        onSaved()
    }

    return (
        <div className="p-5 space-y-4">
            {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
            {[{ k: 'name', l: 'Startup Name *', p: 'Foundry Network' }, { k: 'tagline', l: 'Tagline', p: 'One line pitch' }, { k: 'website', l: 'Website', p: 'https://' }, { k: 'industry', l: 'Industry', p: 'SaaS, Fintech…' }, { k: 'looking_for', l: 'Looking for (comma-separated)', p: 'Co-founder, Developer' }].map(({ k, l, p }) => (
                <div key={k}><label className="block text-xs font-medium text-zinc-400 mb-1">{l}</label><input value={(f as any)[k]} onChange={set(k)} placeholder={p} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></div>
            ))}
            <div><label className="block text-xs font-medium text-zinc-400 mb-1">Stage</label>
                <select value={f.stage} onChange={set('stage')} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none capitalize">{STAGES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}</select>
            </div>
            <div><label className="block text-xs font-medium text-zinc-400 mb-1">Description</label><textarea rows={3} value={f.description} onChange={set('description')} placeholder="What problem do you solve?" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors resize-none" /></div>
            <button onClick={save} disabled={saving} className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">{saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'List Startup'}</button>
        </div>
    )
}
