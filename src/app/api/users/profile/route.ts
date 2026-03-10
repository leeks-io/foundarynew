import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await (supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single() as any)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { full_name, username, bio, avatar_url, role, skills, location, website, twitter, linkedin, github } = body

        const { data, error } = await (supabase
            .from('profiles') as any)
            .update({
                full_name,
                username,
                bio,
                avatar_url,
                role,
                skills: skills || [],
                location,
                website,
                twitter,
                linkedin,
                github
            })
            .eq('id', session.user.id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
