import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    // Get currently logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user record
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
            id,
            username,
            email,
            role,
            is_premium,
            builder_score,
            wallet_address
        `)
        .eq('id', user.id)
        .single()

    if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Fetch profile record
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (profileError && profileError.code !== 'PGRST116') { // Ignore "no rows returned" if they somehow lack a profile
        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
        user: userData,
        profile: profileData || {}
    })
}

export async function PATCH(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { bio, skills, social_links, build_in_public, profile_image, banner_image } = body

        const updates: any = { updated_at: new Date().toISOString() }

        if (bio !== undefined) updates.bio = bio
        if (skills !== undefined) updates.skills = skills
        if (social_links !== undefined) updates.social_links = social_links
        if (build_in_public !== undefined) updates.build_in_public = build_in_public
        if (profile_image !== undefined) updates.profile_image = profile_image
        if (banner_image !== undefined) updates.banner_image = banner_image

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ profile: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
