import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        // Fetch the community
        const { data: community, error: comError } = await supabase
            .from('communities')
            .select('is_public')
            .eq('id', id)
            .single()

        if (comError || !community) return NextResponse.json({ error: 'Community not found' }, { status: 404 })

        // Insert into community members
        const { error } = await (supabase
            .from('community_members') as any)
            .insert({
                community_id: id,
                user_id: session.user.id,
                role: 'member'
            })

        if (error) {
            if (error.code === '23505') return NextResponse.json({ error: 'Already a member' }, { status: 409 })
            throw error
        }

        // Increment member count
        const { data: countData } = await (supabase.from('communities') as any).select('member_count').eq('id', id).single()
        if (countData) {
            await (supabase.from('communities') as any).update({ member_count: (countData as any).member_count + 1 }).eq('id', id)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
