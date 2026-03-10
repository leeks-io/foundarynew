'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { JobWithPoster } from '@/types/database'
import {
    Search, MapPin, Clock, DollarSign, Briefcase,
    Plus, Loader2, X, ChevronDown
} from 'lucide-react'

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const

export default function JobsPage() {
    const supabase = createSupabaseBrowserClient()
    const [jobs, setJobs] = useState<JobWithPoster[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [remoteOnly, setRemoteOnly] = useState(false)
    const [selectedJob, setSelectedJob] = useState<JobWithPoster | null>(null)
    const [showPostModal, setShowPostModal] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [applying, setApplying] = useState(false)
    const [applied, setApplied] = useState<Set<string>>(new Set())

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUserId(session?.user.id ?? null)
            if (session?.user.id) {
                (supabase
                    .from('job_applications') as any)
                    .select('job_id')
                    .eq('applicant_id', session.user.id)
                    .then(({ data }: any) => {
                        setApplied(new Set(data?.map((a: any) => a.job_id) ?? []))
                    })
            }
        })
    }, [])

    const fetchJobs = useCallback(async () => {
        setLoading(true)
        let query = (supabase
            .from('jobs') as any)
            .select('*, profiles(*)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(50)

        if (typeFilter !== 'all') query = query.eq('type', typeFilter)
        if (remoteOnly) query = query.eq('is_remote', true)
        if (search.trim()) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company.ilike.%${search}%`)
        }

        const { data } = await query
        setJobs((data as JobWithPoster[]) ?? [])
        setLoading(false)
    }, [typeFilter, remoteOnly, search])

    useEffect(() => {
        const timer = setTimeout(fetchJobs, 300)
        return () => clearTimeout(timer)
    }, [fetchJobs])

    const handleApply = async (jobId: string) => {
        if (!currentUserId || applying) return
        setApplying(true)
        await (supabase.from('job_applications') as any).insert({
            job_id: jobId,
            applicant_id: currentUserId,
        })
        setApplied(prev => new Set(prev).add(jobId))
        setApplying(false)
    }

    return (
        <div className="min-h-full bg-zinc-900">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-4 sm:px-6 py-4">
                <div className="max-w-6xl mx-auto space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-white">Jobs</h1>
                            <p className="text-sm text-zinc-400">Find your next opportunity</p>
                        </div>
                        {currentUserId && (
                            <button
                                onClick={() => setShowPostModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Post a Job</span>
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search jobs, companies, skills..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                            {['all', ...JOB_TYPES].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(type)}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${typeFilter === type
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    {type === 'all' ? 'All Types' : type}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setRemoteOnly(!remoteOnly)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${remoteOnly ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            Remote only
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <Briefcase className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No jobs found</p>
                        {currentUserId && (
                            <button
                                onClick={() => setShowPostModal(true)}
                                className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200"
                            >
                                Post the first job
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {jobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isApplied={applied.has(job.id)}
                                isApplying={applying}
                                showApply={!!currentUserId && job.founder_id !== currentUserId}
                                onApply={() => handleApply(job.id)}
                                onClick={() => setSelectedJob(job)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Job detail modal */}
            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    isApplied={applied.has(selectedJob.id)}
                    isApplying={applying}
                    showApply={!!currentUserId && selectedJob.founder_id !== currentUserId}
                    onApply={() => handleApply(selectedJob.id)}
                    onClose={() => setSelectedJob(null)}
                />
            )}

            {/* Post job modal */}
            {showPostModal && currentUserId && (
                <PostJobModal
                    userId={currentUserId}
                    onClose={() => setShowPostModal(false)}
                    onPosted={() => { setShowPostModal(false); fetchJobs() }}
                />
            )}
        </div>
    )
}

function JobCard({
    job, isApplied, isApplying, showApply, onApply, onClick
}: {
    job: JobWithPoster
    isApplied: boolean
    isApplying: boolean
    showApply: boolean
    onApply: () => void
    onClick: () => void
}) {
    return (
        <div
            onClick={onClick}
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 cursor-pointer hover:border-zinc-600 transition-colors space-y-3"
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-white font-medium text-sm">{job.title}</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">{job.company || job.profiles?.full_name}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${job.type === 'full-time' ? 'bg-blue-500/20 text-blue-400' :
                    job.type === 'contract' ? 'bg-purple-500/20 text-purple-400' :
                        job.type === 'freelance' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-zinc-700 text-zinc-400'
                    }`}>
                    {job.type}
                </span>
            </div>

            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{job.description}</p>

            {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-zinc-700/60 text-zinc-400 rounded text-xs">{s}</span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-500 text-xs">
                    {(job.location || job.is_remote) && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.is_remote ? 'Remote' : job.location}
                        </span>
                    )}
                    {(job.salary_min || job.salary_max) && (
                        <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary_min && job.salary_max
                                ? `${(job.salary_min / 1000).toFixed(0)}k–${(job.salary_max / 1000).toFixed(0)}k`
                                : job.salary_min
                                    ? `${(job.salary_min / 1000).toFixed(0)}k+`
                                    : `up to ${(job.salary_max! / 1000).toFixed(0)}k`}
                        </span>
                    )}
                </div>

                {showApply && (
                    <button
                        onClick={e => { e.stopPropagation(); onApply() }}
                        disabled={isApplied || isApplying}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${isApplied
                            ? 'bg-zinc-700 text-zinc-500 cursor-default'
                            : 'bg-white text-black hover:bg-zinc-200'
                            }`}
                    >
                        {isApplied ? 'Applied' : 'Apply'}
                    </button>
                )}
            </div>
        </div>
    )
}

function JobDetailModal({
    job, isApplied, isApplying, showApply, onApply, onClose
}: {
    job: JobWithPoster
    isApplied: boolean
    isApplying: boolean
    showApply: boolean
    onApply: () => void
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="fixed inset-0 bg-black/70" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-2xl bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-start justify-between">
                    <div>
                        <h2 className="text-white font-semibold">{job.title}</h2>
                        <p className="text-zinc-400 text-sm">{job.company || job.profiles?.full_name}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white ml-4 shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                        <span className="capitalize px-2 py-1 bg-zinc-800 rounded">{job.type}</span>
                        {job.is_remote && <span className="px-2 py-1 bg-zinc-800 rounded">Remote</span>}
                        {job.location && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded">
                                <MapPin className="w-3 h-3" />{job.location}
                            </span>
                        )}
                        {(job.salary_min || job.salary_max) && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded">
                                <DollarSign className="w-3 h-3" />
                                {job.salary_min && job.salary_max
                                    ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}`
                                    : job.salary_min
                                        ? `From $${job.salary_min.toLocaleString()}`
                                        : `Up to $${job.salary_max!.toLocaleString()}`}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-white font-medium mb-2 text-sm">About this role</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div>
                            <h3 className="text-white font-medium mb-2 text-sm">Skills required</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map(s => (
                                    <span key={s} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Posted by */}
                    {job.profiles && (
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                            {job.profiles.avatar_url ? (
                                <img src={job.profiles.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center">
                                    <span className="text-xs text-zinc-300">
                                        {job.profiles.full_name?.[0] ?? '?'}
                                    </span>
                                </div>
                            )}
                            <div>
                                <p className="text-white text-sm font-medium">{job.profiles.full_name}</p>
                                <p className="text-zinc-500 text-xs">Posted this job</p>
                            </div>
                        </div>
                    )}

                    {showApply && (
                        <button
                            onClick={onApply}
                            disabled={isApplied || isApplying}
                            className={`w-full py-3 rounded-xl font-medium transition-colors ${isApplied
                                ? 'bg-zinc-700 text-zinc-500 cursor-default'
                                : 'bg-white text-black hover:bg-zinc-200'
                                }`}
                        >
                            {isApplying ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : isApplied ? (
                                'Application Submitted'
                            ) : (
                                'Apply Now'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function PostJobModal({
    userId, onClose, onPosted
}: {
    userId: string
    onClose: () => void
    onPosted: () => void
}) {
    const supabase = createSupabaseBrowserClient()
    const [form, setForm] = useState({
        title: '', company: '', description: '', location: '',
        type: 'full-time' as typeof JOB_TYPES[number],
        salary_min: '', salary_max: '', skills: '', is_remote: false
    })
    const [posting, setPosting] = useState(false)
    const [error, setError] = useState('')

    const handlePost = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            setError('Title and description are required.')
            return
        }
        setPosting(true)
        const { error: err } = await (supabase.from('jobs') as any).insert({
            founder_id: userId,
            title: form.title,
            company: form.company || null,
            description: form.description,
            location: form.location || null,
            type: form.type,
            salary_min: form.salary_min ? parseInt(form.salary_min) : null,
            salary_max: form.salary_max ? parseInt(form.salary_max) : null,
            skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
            is_remote: form.is_remote,
        })
        if (err) { setError(err.message); setPosting(false); return }
        onPosted()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="fixed inset-0 bg-black/70" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-xl bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white font-semibold">Post a Job</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-zinc-500 hover:text-white" /></button>
                </div>

                <div className="p-6 space-y-4">
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {[
                        { key: 'title', label: 'Job Title *', placeholder: 'e.g. Senior React Developer' },
                        { key: 'company', label: 'Company', placeholder: 'Your company name' },
                        { key: 'location', label: 'Location', placeholder: 'e.g. San Francisco, CA' },
                    ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={(form as any)[key]}
                                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Job Type</label>
                        <select
                            value={form.type}
                            onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-500"
                        >
                            {JOB_TYPES.map(t => (
                                <option key={t} value={t} className="capitalize">{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { key: 'salary_min', label: 'Min Salary ($)', placeholder: '50000' },
                            { key: 'salary_max', label: 'Max Salary ($)', placeholder: '100000' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
                                <input
                                    type="number"
                                    placeholder={placeholder}
                                    value={(form as any)[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Skills (comma-separated)</label>
                        <input
                            type="text"
                            placeholder="React, TypeScript, Node.js"
                            value={form.skills}
                            onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Description *</label>
                        <textarea
                            rows={4}
                            placeholder="Describe the role, requirements, and what you're looking for..."
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_remote}
                            onChange={e => setForm(f => ({ ...f, is_remote: e.target.checked }))}
                            className="w-4 h-4 rounded accent-white"
                        />
                        <span className="text-sm text-zinc-300">Remote position</span>
                    </label>

                    <button
                        onClick={handlePost}
                        disabled={posting}
                        className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {posting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Post Job'}
                    </button>
                </div>
            </div>
        </div>
    )
}
