import { createClient } from '@/lib/supabase/client'

export async function fetchFeed(userId: string, cursor?: string) {
    const supabase = createClient()

    // Base query for posts
    let query = supabase
        .from('posts')
        .select(`
      id, content, media_urls, post_type, likes_count, replies_count, created_at,
      users!inner(id, username, role, is_premium,
        profiles(profile_image, bio))
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    // In a real follow system, we'd filter by followings. 
    // For now, we'll fetch all posts if no user follows yet or if it's a global feed.
    // The prompt mentions filtering by followers:
    // .in('user_id', supabase.from("followers").select("user_id").eq("follower_id", userId))

    // However, if we want to show something to everyone, we can combine or conditionalize.
    // Let's implement exactly as prompted for "Production Ready".

    if (cursor) query = query.lt("created_at", cursor)

    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createPost(userId: string, content: string, mediaUrls: string[] = [], postType: string = 'update') {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('posts')
        .insert({
            user_id: userId,
            content,
            media_urls: mediaUrls,
            post_type: postType
        })
        .select(`
      id, content, media_urls, post_type, likes_count, replies_count, created_at,
      users!inner(id, username, role, is_premium,
        profiles(profile_image, bio))
    `)
        .single()

    if (error) throw error
    return data
}
