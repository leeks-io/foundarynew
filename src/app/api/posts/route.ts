import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // By default, fetch global posts
    let query = supabase
        .from('posts')
        .select(`
            *,
            author:users(id, username, is_premium, builder_score, role)
        `)
        .order('created_at', { ascending: false })

    if (searchParams.get('type')) {
        query = query.eq('post_type', searchParams.get('type'))
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: data })
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { content, media_urls, post_type } = body

        if (!content) {
            return NextResponse.json({ error: 'Post content is required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                content,
                media_urls: media_urls || [],
                post_type: post_type || 'update'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ post: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
