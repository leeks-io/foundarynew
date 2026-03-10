'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { ServiceWithSeller } from '@/types/database'
import { Search, Plus, Loader2, X, Clock, DollarSign, Tag, Wrench } from 'lucide-react'

const CATEGORIES = ['Design', 'Development', 'Marketing', 'Writing', 'Video', 'Audio', 'Business', 'AI', 'Other']

export default function ServicesPage() {
    const supabase = createSupabaseBrowserClient()
    const [services, setServices] = useState<ServiceWithSeller[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [showPost, setShowPost] = useState(false)
    const [showDetail, setShowDetail] = useState<ServiceWithSeller | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user.id ?? null))
    }, [])

    const load = useCallback(async () => {
        setLoading(true)
        let q = supabase.from('services').select('*, profiles(*)').eq('is_active', true).order('created_at', { ascending: false }).limit(48)
        if (category !== 'all') q = q.eq('category', category)
        if (search.trim()) q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        const { data } = await q
        setServices((data as ServiceWithSeller[]) ?? [])
        setLoading(false)
    }, [category, search])

    useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

    return (
        <div className="min-h-full bg-zinc-900">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-white">Services</h1>
                            <p className="text-xs sm:text-sm text-zinc-500">Hire skilled freelancers</p>
                        </div>
                        {userId && (
                            <button onClick={() => setShowPost(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">
                                <Plus className="w-4 h-4" /><span className="hidden sm:inline">Offer Service</span>
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…" className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                        {['all', ...CATEGORIES].map(c => (
                            <button key={c} onClick={() => setCategory(c)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>{c === 'all' ? 'All' : c}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-44 bg-zinc-800/50 rounded-2xl animate-pulse" />)}
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20">
                        <Wrench className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No services found</p>
                        {userId && <button onClick={() => setShowPost(true)} className="mt-4 px-4 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors">List your first service</button>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map(s => <ServiceCard key={s.id} service={s} onClick={() => setShowDetail(s)} />)}
                    </div>
                )}
            </div>

            {showDetail && <ServiceModal service={showDetail} onClose={() => setShowDetail(null)} userId={userId} />}
            {showPost && userId && <PostServiceModal userId={userId} onClose={() => setShowPost(false)} onSaved={() => { setShowPost(false); load() }} />}
        </div>
    )
}

function ServiceCard({ service, onClick }: { service: ServiceWithSeller; onClick: () => void }) {
    return (
        <button onClick={onClick} className="text-left bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 space-y-3 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all w-full">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    {service.profiles?.avatar_url ? <img src={service.profiles.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" /> : <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs text-zinc-300">{service.profiles?.full_name?.[0] ?? '?'}</div>}
                    <span className="text-zinc-400 text-xs truncate">{service.profiles?.full_name || service.profiles?.username}</span>
                </div>
                {service.category && <span className="shrink-0 px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded-full text-xs">{service.category}</span>}
            </div>
            <div>
                <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">{service.title}</h3>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
            </div>
            {service.tags?.length > 0 && <div className="flex flex-wrap gap-1">{service.tags.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 bg-zinc-700/60 text-zinc-500 rounded text-xs">{t}</span>)}</div>}
            <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1 text-zinc-500 text-xs"><Clock className="w-3 h-3" />{service.delivery_days}d</span>
                <span className="text-white font-semibold text-sm">${service.price.toLocaleString()}</span>
            </div>
        </button>
    )
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
                    <h2 className="text-white font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    )
}

function ServiceModal({ service, onClose, userId }: { service: ServiceWithSeller; onClose: () => void; userId: string | null }) {
    const supabase = createSupabaseBrowserClient()
    const [done, setDone] = useState(false)
    const order = async () => {
        if (!userId) return
        await supabase.from('service_orders' as any).insert({ service_id: service.id, buyer_id: userId, seller_id: service.seller_id, amount: service.price }).catch(() => null)
        setDone(true)
    }
    return (
        <Modal onClose={onClose} title={service.title}>
            <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                    {service.profiles?.avatar_url ? <img src={service.profiles.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-sm">{service.profiles?.full_name?.[0]}</div>}
                    <div><p className="text-white text-sm font-medium">{service.profiles?.full_name}</p><p className="text-zinc-500 text-xs capitalize">{service.profiles?.role}</p></div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-300 text-sm"><DollarSign className="w-3.5 h-3.5" />${service.price.toLocaleString()}</span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-300 text-sm"><Clock className="w-3.5 h-3.5" />{service.delivery_days} days</span>
                    {service.category && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-300 text-sm"><Tag className="w-3.5 h-3.5" />{service.category}</span>}
                </div>
                {service.tags?.length > 0 && <div className="flex flex-wrap gap-2">{service.tags.map(t => <span key={t} className="px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs">{t}</span>)}</div>}
                {userId && userId !== service.seller_id && (
                    <button onClick={order} disabled={done} className={`w-full py-3 rounded-xl font-medium transition-colors ${done ? 'bg-zinc-700 text-zinc-400 cursor-default' : 'bg-white text-black hover:bg-zinc-200'}`}>
                        {done ? '✓ Order placed!' : `Order for $${service.price.toLocaleString()}`}
                    </button>
                )}
            </div>
        </Modal>
    )
}

function PostServiceModal({ userId, onClose, onSaved }: { userId: string; onClose: () => void; onSaved: () => void }) {
    const supabase = createSupabaseBrowserClient()
    const [f, setF] = useState({ title: '', description: '', category: '', price: '', delivery_days: '7', tags: '' })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')
    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }))

    const save = async () => {
        if (!f.title.trim() || !f.description.trim() || !f.price) { setErr('Title, description and price required'); return }
        setSaving(true)
        const { error } = await supabase.from('services').insert({ seller_id: userId, title: f.title.trim(), description: f.description.trim(), category: f.category || null, price: Number(f.price), delivery_days: Number(f.delivery_days) || 7, tags: f.tags ? f.tags.split(',').map(t => t.trim()).filter(Boolean) : [] })
        if (error) { setErr(error.message); setSaving(false); return }
        onSaved()
    }

    return (
        <Modal onClose={onClose} title="Offer a Service">
            <div className="p-5 space-y-4">
                {err && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{err}</p>}
                <Field label="Service Title *" placeholder="e.g. I will design your brand logo"><input value={f.title} onChange={set('title')} placeholder="e.g. I will design your brand logo" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Price ($) *"><input type="number" value={f.price} onChange={set('price')} placeholder="100" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></Field>
                    <Field label="Delivery (days)"><input type="number" value={f.delivery_days} onChange={set('delivery_days')} placeholder="7" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></Field>
                </div>
                <Field label="Category">
                    <select value={f.category} onChange={set('category')} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none">
                        <option value="">Select…</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Tags (comma-separated)"><input value={f.tags} onChange={set('tags')} placeholder="logo, branding, design" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors" /></Field>
                <Field label="Description *"><textarea rows={4} value={f.description} onChange={set('description')} placeholder="Describe what you offer…" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors resize-none" /></Field>
                <button onClick={save} disabled={saving} className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'List Service'}
                </button>
            </div>
        </Modal>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>{children}</div>
}
