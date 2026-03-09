import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()

    // Public lookup, so we don't necessarily require auth to view
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
            id,
            username,
            role,
            is_premium,
            builder_score,
            created_at
        `)
        .eq('username', username)
        .single()

    if (userError || !userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch the public profile
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('bio, skills, portfolio_links, social_links, profile_image, banner_image, verified, build_in_public')
        .eq('user_id', userData.id)
        .single()

    // Just return what we can
    return NextResponse.json({
        user: userData,
        profile: profileData || {}
    })
}
