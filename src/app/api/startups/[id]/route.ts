import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('startups')
        .select(`
            *,
            founder:users(id, username, is_premium, builder_score)
        `)
        .eq('id', id)
        .single()

    if (error || !data) {
        return NextResponse.json({ error: 'Startup not found' }, { status: 404 })
    }

    return NextResponse.json({ startup: data })
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, one_liner, description, industry, stage, website_url, logo_url } = body

        // Only the founder who created the startup can edit it
        const { data: startupInfo } = await supabase.from('startups').select('founder_id').eq('id', id).single()
        if (startupInfo?.founder_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updates: any = { updated_at: new Date().toISOString() }
        if (name !== undefined) updates.name = name
        if (one_liner !== undefined) updates.one_liner = one_liner
        if (description !== undefined) updates.description = description
        if (industry !== undefined) updates.industry = industry
        if (stage !== undefined) updates.stage = stage
        if (website_url !== undefined) updates.website_url = website_url
        if (logo_url !== undefined) updates.logo_url = logo_url

        const { data, error } = await supabase
            .from('startups')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ startup: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
