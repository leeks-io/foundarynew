import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    let query = supabase
        .from('startups')
        .select(`
            *,
            founder:users(id, username, is_premium, builder_score)
        `)
        .order('created_at', { ascending: false })

    if (searchParams.get('stage')) {
        query = query.eq('stage', searchParams.get('stage'))
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ startups: data })
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role check - Only founders can register startups
    const { data: userData } = await supabase.from('users').select('role, is_premium').eq('id', user.id).single()
    if (userData?.role !== 'founder') {
        return NextResponse.json({ error: 'Only founders can register startups' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, one_liner, description, industry, stage, website_url, logo_url } = body

        if (!name || !one_liner || !industry) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('startups')
            .insert({
                founder_id: user.id,
                name,
                one_liner,
                description,
                industry,
                stage: stage || 'idea',
                website_url,
                logo_url
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ startup: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
