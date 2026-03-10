import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Step 1: Get the list of user IDs that the current user is following
    const { data: followingData } = await (supabase
        .from('connections')
        .select('recipient_id')
        .eq('requester_id', session.user.id)
        .eq('status', 'accepted') as any)

    const userIds = followingData ? followingData.map((f: any) => f.recipient_id) : []
    userIds.push(session.user.id)

    // Step 2: Fetch posts from these users with profile info
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:profiles(id, username, full_name, avatar_url, role)
        `)
        .in('author_id', userIds)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(posts ?? [])
}
