'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Profile } from '@/types/database'
import { Search, MapPin, ExternalLink, UserPlus, Check, Loader2 } from 'lucide-react'

const ROLES = ['all', 'founder', 'freelancer', 'jobseeker', 'investor'] as const
const ROLE_LABELS: Record<string, string> = {
    all: 'Everyone',
    founder: 'Founders',
    freelancer: 'Freelancers',
    jobseeker: 'Job Seekers',
    investor: 'Investors',
}

export default function ExplorePage() {
    const supabase = createSupabaseBrowserClient()
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [role, setRole] = useState<string>('all')
    const [connected, setConnected] = useState<Set<string>>(new Set())
    const [connecting, setConnecting] = useState<Set<string>>(new Set())
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUserId(session?.user.id ?? null)
        })
    }, [])

    const fetchProfiles = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(48)

        if (role !== 'all') query = query.eq('role', role)
        if (search.trim()) {
            query = query.or(
                `full_name.ilike.%${search}%,username.ilike.%${search}%,bio.ilike.%${search}%`
            )
        }

        const { data } = await query
        setProfiles((data ?? []).filter(p => p.id !== currentUserId))
        setLoading(false)
    }, [role, search, currentUserId])

    useEffect(() => {
        const timer = setTimeout(fetchProfiles, 300)
        return () => clearTimeout(timer)
    }, [fetchProfiles])

    // Fetch existing connections
    useEffect(() => {
        if (!currentUserId) return
        supabase
            .from('connections')
            .select('recipient_id')
            .eq('requester_id', currentUserId)
            .then(({ data }) => {
                setConnected(new Set(data?.map(c => c.recipient_id) ?? []))
            })
    }, [currentUserId])

    const handleConnect = async (profileId: string) => {
        if (!currentUserId || connecting.has(profileId)) return
        setConnecting(prev => new Set(prev).add(profileId))
        await supabase.from('connections').insert({
            requester_id: currentUserId,
            recipient_id: profileId,
        })
        setConnected(prev => new Set(prev).add(profileId))
        setConnecting(prev => { const s = new Set(prev); s.delete(profileId); return s })
    }

    return (
        <div className="min-h-full bg-zinc-900">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-4 sm:px-6 py-4">
                <div className="max-w-6xl mx-auto space-y-3">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Explore</h1>
                        <p className="text-sm text-zinc-400">Discover builders, founders, and freelancers</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by name, username, or bio..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                        />
                    </div>

                    {/* Role filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {ROLES.map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${role === r
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                                    }`}
                            >
                                {ROLE_LABELS[r]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 text-sm">No users found</p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-3 text-sm text-zinc-400 underline hover:text-white"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {profiles.map(profile => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                isConnected={connected.has(profile.id)}
                                isConnecting={connecting.has(profile.id)}
                                onConnect={() => handleConnect(profile.id)}
                                showConnect={!!currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ProfileCard({
    profile,
    isConnected,
    isConnecting,
    onConnect,
    showConnect,
}: {
    profile: Profile
    isConnected: boolean
    isConnecting: boolean
    onConnect: () => void
    showConnect: boolean
}) {
    const initials = profile.full_name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? '??'

    return (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex flex-col gap-3 hover:border-zinc-600 transition-colors">
            {/* Avatar + name */}
            <div className="flex items-start gap-3">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={profile.full_name ?? ''}
                        className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-zinc-300">{initials}</span>
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                        {profile.full_name || profile.username || 'Anonymous'}
                    </p>
                    {profile.username && (
                        <p className="text-zinc-500 text-xs truncate">@{profile.username}</p>
                    )}
                    {profile.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300 text-xs capitalize">
                            {profile.role}
                        </span>
                    )}
                </div>
            </div>

            {/* Bio */}
            {profile.bio && (
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{profile.bio}</p>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 4).map(skill => (
                        <span
                            key={skill}
                            className="px-2 py-0.5 bg-zinc-700/60 text-zinc-400 rounded text-xs"
                        >
                            {skill}
                        </span>
                    ))}
                    {profile.skills.length > 4 && (
                        <span className="px-2 py-0.5 text-zinc-600 text-xs">+{profile.skills.length - 4}</span>
                    )}
                </div>
            )}

            {/* Location */}
            {profile.location && (
                <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{profile.location}</span>
                </div>
            )}

            {/* Actions */}
            {showConnect && (
                <button
                    onClick={onConnect}
                    disabled={isConnected || isConnecting}
                    className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${isConnected
                            ? 'bg-zinc-700 text-zinc-400 cursor-default'
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                >
                    {isConnecting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isConnected ? (
                        <>
                            <Check className="w-3 h-3" />
                            Connected
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-3 h-3" />
                            Connect
                        </>
                    )}
                </button>
            )}
        </div>
    )
}
