'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import {
    Plus, MessageSquare, Heart, Share2,
    Image as ImageIcon, Loader2, MoreHorizontal,
    Search, Bell
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Profile {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    role: string | null
}

interface Post {
    id: string
    content: string
    image_url: string | null
    likes_count: number
    comments_count: number
    created_at: string
    profiles: Profile
}

export default function DashboardPage() {
    const supabase = createSupabaseBrowserClient()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    // New post state
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [posting, setPosting] = useState(false)

    const fetchPosts = useCallback(async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*, profiles(id, username, full_name, avatar_url, role)')
            .order('created_at', { ascending: false })
            .limit(30)

        if (data) setPosts(data as any)
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })
        fetchPosts()
    }, [fetchPosts, supabase.auth])

    const handlePost = async () => {
        if (!content.trim() || !user) return
        setPosting(true)

        const { error } = await supabase.from('posts').insert({
            author_id: user.id,
            content: content.trim(),
            image_url: imageUrl || null
        })

        if (!error) {
            setContent('')
            setImageUrl('')
            fetchPosts()
        }
        setPosting(false)
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

            {/* Create Post */}
            {user && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                            {user.user_metadata?.avatar_url && (
                                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                placeholder="What's happening in the network?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 resize-none py-2 text-lg"
                                rows={2}
                            />

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                                <div className="flex gap-2">
                                    <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={!content.trim() || posting}
                                    className="px-6 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                                >
                                    {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feed */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl border-dashed">
                        <p className="text-zinc-500">No posts yet. Be the first to start the conversation!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-700 transition-colors">
                            <div className="p-4 flex gap-4">
                                {/* Author Avatar */}
                                <Link href={`/dashboard/profile/${post.profiles?.username}`} className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 shadow-inner">
                                    {post.profiles?.avatar_url ? (
                                        <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold uppercase text-xs">
                                            {post.profiles?.full_name?.[0] || post.profiles?.username?.[0] || 'F'}
                                        </div>
                                    )}
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-semibold text-white truncate text-sm">
                                                {post.profiles?.full_name || post.profiles?.username}
                                            </span>
                                            <span className="text-zinc-500 text-xs shrink-0">
                                                • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <button className="text-zinc-600 hover:text-white p-1">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-zinc-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
                                        {post.content}
                                    </p>

                                    {post.image_url && (
                                        <div className="mb-3 rounded-xl overflow-hidden border border-zinc-800">
                                            <img src={post.image_url} alt="" className="w-full h-auto object-cover max-h-96" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 pt-1">
                                        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 text-xs group transition-colors">
                                            <Heart className="w-4 h-4 group-hover:fill-current" />
                                            <span>{post.likes_count}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 text-xs transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{post.comments_count}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs transition-colors ml-auto">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
