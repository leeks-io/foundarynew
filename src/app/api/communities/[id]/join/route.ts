import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { invite_code } = body

        // Fetch the community
        const { data: community, error: comError } = await supabase
            .from('communities')
            .select('is_private, invite_code')
            .eq('id', params.id)
            .single()

        if (comError || !community) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 })
        }

        // If private, check invite code
        if (community.is_private) {
            if (community.invite_code !== invite_code) {
                return NextResponse.json({ error: 'Invalid or missing invite code' }, { status: 403 })
            }
        }

        // Insert into community members
        const { error } = await supabase
            .from('community_members')
            .insert({
                community_id: params.id,
                user_id: user.id,
                role: 'member'
            })

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'You are already a member of this community' }, { status: 409 })
            }
            throw error
        }

        // Increment member count using rpc ideally, but manual update for simplicity here
        const { data: countData } = await supabase.from('communities').select('member_count').eq('id', params.id).single()
        if (countData) {
            await supabase.from('communities').update({ member_count: countData.member_count + 1 }).eq('id', params.id)
        }

        return NextResponse.json({ success: true, message: 'Joined community' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
