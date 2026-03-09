import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the target user ID from the username
    const { data: targetUser, error: targetError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

    if (targetError || !targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if the current user is following the target user
    const { data: followData, error: followError } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('user_id', targetUser.id)
        .single()

    // If no row is returned, PGRST116 means not following.
    if (!followData) {
        return NextResponse.json({ is_following: false })
    }

    return NextResponse.json({ is_following: true })
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the target user ID from the username
    const { data: targetUser, error: targetError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

    if (targetError || !targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser.id === user.id) {
        return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 })
    }

    try {
        const body = await request.json()
        const { action } = body // 'follow' or 'unfollow'

        if (action === 'follow') {
            const { error } = await supabase
                .from('followers')
                .insert({ user_id: targetUser.id, follower_id: user.id })

            if (error && error.code !== '23505') throw error // ignore unique constraint if already following

            return NextResponse.json({ success: true, is_following: true })
        } else if (action === 'unfollow') {
            const { error } = await supabase
                .from('followers')
                .delete()
                .eq('user_id', targetUser.id)
                .eq('follower_id', user.id)

            if (error) throw error

            return NextResponse.json({ success: true, is_following: false })
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
