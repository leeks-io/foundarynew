'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Profile } from '@/types/database'
import {
    Edit2, Save, X, MapPin, Globe, Twitter, Linkedin,
    Github, Loader2, Plus, Camera, User
} from 'lucide-react'

const ROLES = ['founder', 'freelancer', 'jobseeker', 'investor'] as const
const INPUT = 'w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors'

export default function ProfilePage() {
    const supabase = createSupabaseBrowserClient()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState<Partial<Profile>>({})
    const [skillInput, setSkillInput] = useState('')

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { setLoading(false); return }

            let { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()

            // Auto-create profile if it doesn't exist yet
            if (!data) {
                const meta = session.user.user_metadata
                const email = session.user.email ?? ''
                const username = email.split('@')[0].toLowerCase() + '_' + session.user.id.slice(0, 6)
                await supabase.from('profiles').insert({
                    id: session.user.id,
                    username,
                    full_name: meta?.full_name ?? meta?.name ?? email.split('@')[0],
                    avatar_url: meta?.avatar_url ?? null,
                    skills: [],
                    is_premium: false,
                })
                const { data: created } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
                data = created
            }

            setProfile(data)
            setForm(data ?? {})
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        if (!profile) return
        setSaving(true); setError('')
        const { error: err } = await supabase.from('profiles').update({
            full_name: form.full_name || null,
            username: form.username || null,
            bio: form.bio || null,
            location: form.location || null,
            website: form.website || null,
            twitter: form.twitter || null,
            linkedin: form.linkedin || null,
            github: form.github || null,
            role: (form.role || null) as any,
            skills: form.skills ?? [],
        }).eq('id', profile.id)
        if (err) { setError(err.message); setSaving(false); return }
        const { data } = await supabase.from('profiles').select('*').eq('id', profile.id).single()
        setProfile(data); setForm(data ?? {}); setEditing(false); setSaving(false)
    }

    const addSkill = () => {
        const skill = skillInput.trim()
        if (!skill || (form.skills ?? []).includes(skill)) { setSkillInput(''); return }
        setForm(f => ({ ...f, skills: [...(f.skills ?? []), skill] }))
        setSkillInput('')
    }

    const removeSkill = (s: string) => setForm(f => ({ ...f, skills: (f.skills ?? []).filter(x => x !== s) }))

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-zinc-500 animate-spin" /></div>

    if (!profile) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <User className="w-10 h-10 text-zinc-700" />
            <p className="text-zinc-500 text-sm">Profile not found. Please sign out and sign in again.</p>
        </div>
    )

    const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }))

    const initials = profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

    return (
        <div className="min-h-full bg-zinc-900">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-white">Profile</h1>
                    {!editing ? (
                        <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => { setEditing(false); setForm(profile) }} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-sm hover:bg-zinc-700 transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">{error}</p>}

                {/* Avatar + Name */}
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        {profile.avatar_url
                            ? <img src={profile.avatar_url} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover" />
                            : <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-700 flex items-center justify-center"><span className="text-lg sm:text-xl font-semibold text-zinc-300">{initials}</span></div>
                        }
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-lg sm:text-xl truncate">{profile.full_name || 'No name set'}</p>
                        <p className="text-zinc-500 text-sm truncate">@{profile.username || 'no-username'}</p>
                        {profile.role && <span className="mt-1 inline-block px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full text-xs capitalize">{profile.role}</span>}
                    </div>
                </div>

                {/* View mode */}
                {!editing ? (
                    <div className="space-y-5">
                        {profile.bio && (
                            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4">
                                <p className="text-zinc-300 text-sm leading-relaxed">{profile.bio}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {profile.skills?.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map(s => <span key={s} className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">{s}</span>)}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        <div className="space-y-2">
                            {profile.location && <div className="flex items-center gap-2 text-zinc-400 text-sm"><MapPin className="w-4 h-4 shrink-0 text-zinc-600" />{profile.location}</div>}
                            {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"><Globe className="w-4 h-4 shrink-0 text-zinc-600" />{profile.website}</a>}
                            {profile.twitter && <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"><Twitter className="w-4 h-4 shrink-0 text-zinc-600" />{profile.twitter}</a>}
                            {profile.linkedin && <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"><Linkedin className="w-4 h-4 shrink-0 text-zinc-600" />{profile.linkedin}</a>}
                            {profile.github && <a href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"><Github className="w-4 h-4 shrink-0 text-zinc-600" />{profile.github}</a>}
                        </div>

                        {!profile.bio && !profile.location && !profile.website && profile.skills?.length === 0 && (
                            <div className="text-center py-8 border border-dashed border-zinc-700 rounded-2xl">
                                <p className="text-zinc-600 text-sm">Your profile is empty.</p>
                                <button onClick={() => setEditing(true)} className="mt-2 text-white text-sm hover:underline">Add your details →</button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Edit mode */
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label><input value={form.full_name ?? ''} onChange={set('full_name')} placeholder="Your name" className={INPUT} /></div>
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Username</label><input value={form.username ?? ''} onChange={set('username')} placeholder="handle" className={INPUT} /></div>
                        </div>
                        <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Role</label>
                            <select value={form.role ?? ''} onChange={set('role')} className={INPUT}>
                                <option value="">Select role…</option>
                                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Bio</label><textarea rows={3} value={form.bio ?? ''} onChange={set('bio')} placeholder="Tell people about yourself…" className={`${INPUT} resize-none`} /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Location</label><input value={form.location ?? ''} onChange={set('location')} placeholder="Lagos, Nigeria" className={INPUT} /></div>
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Website</label><input value={form.website ?? ''} onChange={set('website')} placeholder="https://…" className={INPUT} /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Twitter / X</label><input value={form.twitter ?? ''} onChange={set('twitter')} placeholder="@username" className={INPUT} /></div>
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">LinkedIn</label><input value={form.linkedin ?? ''} onChange={set('linkedin')} placeholder="linkedin.com/in/…" className={INPUT} /></div>
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">GitHub</label><input value={form.github ?? ''} onChange={set('github')} placeholder="github.com/…" className={INPUT} /></div>
                        </div>
                        {/* Skills editor */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Skills</label>
                            <div className="flex gap-2 mb-2">
                                <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill and press Enter" className={`${INPUT} flex-1`} />
                                <button onClick={addSkill} className="shrink-0 px-3 py-2 bg-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-600 transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                            {(form.skills ?? []).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {(form.skills ?? []).map(s => (
                                        <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                                            {s}
                                            <button onClick={() => removeSkill(s)} className="text-zinc-600 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
