'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import type { Profile } from '@/types/database'
import { Heart, MessageCircle, Share2, Loader2, Send, MoreHorizontal, Trash2, ImageIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Post {
    id: string
    author_id: string
    content: string
    image_url: string | null
    likes_count: number
    comments_count: number
    created_at: string
    profiles: Profile
}

function UserAvatar({ profile, size = 'sm' }: { profile: Profile | null; size?: 'sm' | 'md' | 'lg' }) {
    const sz = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'md' ? 'w-10 h-10 text-xs' : 'w-8 h-8 text-xs'
    const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
    if (profile?.avatar_url) return <img src={profile.avatar_url} alt="" className={`${sz} rounded-full object-cover shrink-0`} />
    return <div className={`${sz} rounded-full bg-zinc-700 flex items-center justify-center shrink-0`}><span className="font-medium text-zinc-300">{initials}</span></div>
}

export default function DashboardPage() {
    const supabase = createSupabaseBrowserClient()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [content, setContent] = useState('')
    const [posting, setPosting] = useState(false)
    const [liked, setLiked] = useState<Set<string>>(new Set())
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
                setProfile(p)
                const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', session.user.id)
                setLiked(new Set(likes?.map((l: any) => l.post_id) ?? []))
            }
            const { data } = await supabase.from('posts').select('*, profiles(*)').order('created_at', { ascending: false }).limit(30)
            setPosts((data as Post[]) ?? [])
            setLoading(false)
        }
        init()
    }, [])

    const handlePost = async () => {
        if (!content.trim() || posting || !profile) return
        setPosting(true)
        const { data, error } = await supabase.from('posts').insert({ author_id: profile.id, content: content.trim() }).select('*, profiles(*)').single()
        if (!error && data) {
            setPosts(prev => [data as Post, ...prev])
            setContent('')
            if (textareaRef.current) textareaRef.current.style.height = 'auto'
        }
        setPosting(false)
    }

    const handleLike = async (postId: string) => {
        if (!profile) return
        const isLiked = liked.has(postId)
        setLiked(prev => { const s = new Set(prev); isLiked ? s.delete(postId) : s.add(postId); return s })
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) } : p))
        if (isLiked) await supabase.from('post_likes').delete().match({ post_id: postId, user_id: profile.id })
        else await supabase.from('post_likes').insert({ post_id: postId, user_id: profile.id })
    }

    const handleDelete = async (postId: string) => {
        await supabase.from('posts').delete().eq('id', postId)
        setPosts(prev => prev.filter(p => p.id !== postId))
        setOpenMenu(null)
    }

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    return (
        <div className="min-h-full bg-zinc-900" onClick={() => openMenu && setOpenMenu(null)}>
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

                {/* Create Post Box */}
                {profile && (
                    <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-4">
                        <div className="flex gap-3">
                            <UserAvatar profile={profile} size="md" />
                            <div className="flex-1 min-w-0">
                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={autoResize}
                                    onKeyDown={e => e.key === 'Enter' && e.metaKey && handlePost()}
                                    placeholder={`What's on your mind, ${profile.full_name?.split(' ')[0] ?? 'there'}?`}
                                    rows={2}
                                    className="w-full bg-transparent text-white placeholder-zinc-500 text-sm resize-none focus:outline-none leading-relaxed min-h-[3rem]"
                                />
                                {content.trim() && (
                                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-zinc-700/50">
                                        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
                                            <ImageIcon className="w-3.5 h-3.5" /> Photo
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs tabular-nums ${content.length > 480 ? 'text-red-400' : 'text-zinc-600'}`}>{content.length}/500</span>
                                            <button onClick={() => { setContent(''); if (textareaRef.current) textareaRef.current.style.height = 'auto' }} className="px-3 py-1.5 text-zinc-400 hover:text-white text-xs rounded-lg transition-colors">Cancel</button>
                                            <button
                                                onClick={handlePost}
                                                disabled={posting || !content.trim() || content.length > 500}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-40 transition-colors"
                                            >
                                                {posting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Feed */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-zinc-800/50 border border-zinc-700/40 rounded-2xl p-4 space-y-3 animate-pulse">
                                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-zinc-700" /><div className="space-y-1.5"><div className="h-3 w-24 bg-zinc-700 rounded" /><div className="h-2.5 w-16 bg-zinc-700/60 rounded" /></div></div>
                                <div className="space-y-2"><div className="h-3 bg-zinc-700/60 rounded w-full" /><div className="h-3 bg-zinc-700/60 rounded w-3/4" /></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-6 h-6 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 font-medium text-sm">No posts yet</p>
                        <p className="text-zinc-600 text-xs mt-1">Be the first to share something</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map(post => (
                            <article key={post.id} className="bg-zinc-800/50 border border-zinc-700/40 rounded-2xl p-4 space-y-3 hover:border-zinc-600/60 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <UserAvatar profile={post.profiles} />
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium leading-none truncate">{post.profiles?.full_name || post.profiles?.username || 'User'}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {post.profiles?.role && <span className="text-zinc-500 text-xs capitalize">{post.profiles.role}</span>}
                                                <span className="text-zinc-700 text-xs">·</span>
                                                <span className="text-zinc-600 text-xs">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {profile?.id === post.author_id && (
                                        <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)} className="p-1 text-zinc-600 hover:text-zinc-300 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                            {openMenu === post.id && (
                                                <div className="absolute right-0 top-7 z-20 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden w-36">
                                                    <button onClick={() => handleDelete(post.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-zinc-700/80 text-xs transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete post
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>

                                {post.image_url && <img src={post.image_url} alt="" className="w-full rounded-xl object-cover max-h-80" />}

                                <div className="flex items-center gap-5 pt-1">
                                    <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${liked.has(post.id) ? 'text-red-400' : 'text-zinc-500 hover:text-red-400'}`}>
                                        <Heart className={`w-4 h-4 ${liked.has(post.id) ? 'fill-current' : ''}`} />
                                        {post.likes_count > 0 && <span>{post.likes_count}</span>}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
                                        <MessageCircle className="w-4 h-4" />
                                        {post.comments_count > 0 && <span>{post.comments_count}</span>}
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id).catch(() => { })}
                                        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
