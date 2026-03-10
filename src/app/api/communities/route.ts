import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    let query = supabase
        .from('communities')
        .select(`
            *,
            profiles:profiles(id, username, full_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role, is_premium').eq('id', session.user.id).single()
    if (!profile?.is_premium && profile?.role !== 'founder') {
        return NextResponse.json({ error: 'Only founders or Premium members can create communities' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, description, category, is_public } = body

        if (!name) return NextResponse.json({ error: 'Community name is required' }, { status: 400 })

        const { data: community, error } = await supabase
            .from('communities')
            .insert({
                creator_id: session.user.id,
                name,
                description: description || null,
                category: category || 'General',
                is_public: is_public ?? true,
                member_count: 1
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') return NextResponse.json({ error: 'A community with this name already exists' }, { status: 409 })
            throw error
        }

        // Add creator as member
        await supabase.from('community_members').insert({
            community_id: community.id,
            user_id: session.user.id,
            role: 'admin'
        })

        return NextResponse.json(community, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
