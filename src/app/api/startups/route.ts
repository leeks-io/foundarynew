import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    let query = supabase
        .from('startups')
        .select(`
            *,
            profiles:profiles(id, username, full_name, avatar_url, role)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

    if (searchParams.get('stage')) {
        query = query.eq('stage', searchParams.get('stage'))
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Role check - Only founders can register startups
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (profile?.role !== 'founder') {
        return NextResponse.json({ error: 'Only founders can register startups' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, tagline, description, industry, stage, website, logo_url, looking_for } = body

        if (!name || !tagline || !industry) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('startups')
            .insert({
                founder_id: session.user.id,
                name,
                tagline,
                description,
                industry,
                stage: stage || 'idea',
                website: website || null,
                logo_url: logo_url || null,
                looking_for: looking_for || [],
                is_public: true
            })
            .select('*, profiles:profiles(id, username, full_name, avatar_url, role)')
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
