import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 1: Get the list of user IDs that the current user is following
    const { data: followingData, error: followError } = await supabase
        .from('followers')
        .select('user_id')
        .eq('follower_id', user.id)

    if (followError) {
        return NextResponse.json({ error: followError.message }, { status: 500 })
    }

    // Create an array of IDs to fetch posts from, including the user's own ID
    const userIds = followingData ? followingData.map(f => f.user_id) : []
    userIds.push(user.id)

    // Step 2: Fetch posts only from these users
    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
            *,
            author:users(id, username, is_premium, builder_score, role),
            profile:profiles!inner(profile_image)
        `)
        .in('user_id', userIds)
        // Manual join on user_id
        .eq('profiles.user_id', 'author.id')
        .order('created_at', { ascending: false })

    if (postsError) {
        // Fallback simpler query
        const { data: simplePosts, error: simpleError } = await supabase
            .from('posts')
            .select(`
                *,
                author:users(id, username, is_premium, builder_score, role)
            `)
            .in('user_id', userIds)
            .order('created_at', { ascending: false })

        if (simpleError) return NextResponse.json({ error: simpleError.message }, { status: 500 })
        return NextResponse.json({ feed: simplePosts })
    }

    return NextResponse.json({ feed: posts })
}
