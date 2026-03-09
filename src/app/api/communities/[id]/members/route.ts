import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Retrieve the community info to see if it's private
    const { data: community, error: comError } = await supabase
        .from('communities')
        .select('is_private')
        .eq('id', params.id)
        .single()

    if (comError || !community) {
        return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    if (community.is_private) {
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized to view private community members' }, { status: 401 })
        }

        const { data: membership } = await supabase
            .from('community_members')
            .select('role')
            .eq('community_id', params.id)
            .eq('user_id', user.id)
            .single()

        if (!membership) {
            return NextResponse.json({ error: 'Forbidden. You are not a member of this private community.' }, { status: 403 })
        }
    }

    // Fetch members
    const { data, error } = await supabase
        .from('community_members')
        .select(`
            id,
            role,
            joined_at,
            user:users(id, username, is_premium, builder_score)
        `)
        .eq('community_id', params.id)
        .order('joined_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ members: data })
}
