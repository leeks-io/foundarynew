import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Fetch all public communities (if authenticated, they can see public ones)
    let query = supabase
        .from('communities')
        .select(`
            *,
            creator:users(id, username)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ communities: data })
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role check - Only premium or founders usually create communities? 
    // Just enforce Premium for Community Creation
    const { data: userData } = await supabase.from('users').select('role, is_premium').eq('id', user.id).single()

    if (!userData?.is_premium && userData?.role !== 'founder') {
        return NextResponse.json({ error: 'Only founders or Premium members can create communities' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, description, category, is_private } = body

        if (!name) {
            return NextResponse.json({ error: 'Community name is required' }, { status: 400 })
        }

        const invite_code = is_private ? Math.random().toString(36).substring(2, 10).toUpperCase() : null

        const { data: community, error } = await supabase
            .from('communities')
            .insert({
                creator_id: user.id,
                name,
                description,
                category: category || 'General',
                is_private: is_private || false,
                invite_code,
                member_count: 1
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'A community with this name already exists' }, { status: 409 })
            }
            throw error
        }

        // Add the creator as an admin member
        await supabase
            .from('community_members')
            .insert({
                community_id: community.id,
                user_id: user.id,
                role: 'admin'
            })

        return NextResponse.json({ community }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
