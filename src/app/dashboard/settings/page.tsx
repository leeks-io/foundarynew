'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Profile } from '@/types/database'
import { Loader2, Check, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ROLES = ['founder', 'freelancer', 'jobseeker', 'investor'] as const
const INPUT = 'w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors'

export default function SettingsPage() {
    const supabase = createSupabaseBrowserClient()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [pwSaving, setPwSaving] = useState(false)
    const [pwMsg, setPwMsg] = useState('')
    const [form, setForm] = useState({
        full_name: '', username: '', bio: '', location: '',
        website: '', twitter: '', linkedin: '', github: '',
        role: '' as any, skills: ''
    })

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return
            setEmail(session.user.email ?? '')
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
            if (data) {
                setProfile(data)
                setForm({
                    full_name: data.full_name ?? '',
                    username: data.username ?? '',
                    bio: data.bio ?? '',
                    location: data.location ?? '',
                    website: data.website ?? '',
                    twitter: data.twitter ?? '',
                    linkedin: data.linkedin ?? '',
                    github: data.github ?? '',
                    role: data.role ?? '',
                    skills: (data.skills ?? []).join(', '),
                })
            }
            setLoading(false)
        }
        init()
    }, [])

    const saveProfile = async () => {
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
            skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        }).eq('id', profile.id)
        if (err) setError(err.message)
        else { setSaved(true); setTimeout(() => setSaved(false), 2500) }
        setSaving(false)
    }

    const changePassword = async () => {
        if (!newPassword || newPassword.length < 6) { setPwMsg('Minimum 6 characters'); return }
        setPwSaving(true); setPwMsg('')
        const { error: err } = await supabase.auth.updateUser({ password: newPassword })
        setPwMsg(err ? err.message : 'Password updated successfully')
        setNewPassword('')
        setPwSaving(false)
    }

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }))

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-zinc-500 animate-spin" /></div>

    return (
        <div className="min-h-full bg-zinc-900">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
                <div>
                    <h1 className="text-xl font-semibold text-white">Settings</h1>
                    <p className="text-zinc-500 text-sm mt-0.5">Manage your account and profile</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-2">Profile</h2>
                    {error && <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Full Name</label><input value={form.full_name} onChange={set('full_name')} placeholder="Your name" className={INPUT} /></div>
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Username</label><input value={form.username} onChange={set('username')} placeholder="handle" className={INPUT} /></div>
                    </div>
                    <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Role</label>
                        <select value={form.role} onChange={set('role')} className={INPUT}>
                            <option value="">Select role…</option>
                            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Bio</label><textarea rows={3} value={form.bio} onChange={set('bio')} placeholder="Tell people about yourself…" className={INPUT + ' resize-none'} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Location</label><input value={form.location} onChange={set('location')} placeholder="Lagos, Nigeria" className={INPUT} /></div>
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Website</label><input value={form.website} onChange={set('website')} placeholder="https://…" className={INPUT} /></div>
                    </div>
                    <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Skills (comma-separated)</label><input value={form.skills} onChange={set('skills')} placeholder="React, TypeScript, Design…" className={INPUT} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">Twitter / X</label><input value={form.twitter} onChange={set('twitter')} placeholder="@username" className={INPUT} /></div>
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">LinkedIn</label><input value={form.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/…" className={INPUT} /></div>
                        <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">GitHub</label><input value={form.github} onChange={set('github')} placeholder="github.com/…" className={INPUT} /></div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
                            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Profile'}
                        </button>
                        <span className="text-zinc-600 text-xs truncate">{email}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-2">Security</h2>
                    <div className="space-y-1.5"><label className="block text-xs font-medium text-zinc-400">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" className={INPUT} /></div>
                    {pwMsg && <p className={`text-xs ${pwMsg.includes('updated') ? 'text-green-400' : 'text-red-400'}`}>{pwMsg}</p>}
                    <button onClick={changePassword} disabled={pwSaving} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-700 text-white rounded-xl text-sm font-medium hover:bg-zinc-600 disabled:opacity-50 transition-colors">
                        {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Update Password
                    </button>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-2">Account</h2>
                    <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-white text-sm font-medium">Sign out</p>
                            <p className="text-zinc-500 text-xs mt-0.5">You will be redirected to the login page.</p>
                            <button onClick={async () => { await supabase.auth.signOut(); router.replace('/auth') }} className="mt-3 px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">Sign out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
