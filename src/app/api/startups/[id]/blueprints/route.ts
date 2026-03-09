import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blueprints')
        .select(`
            *,
            startup:startups(id, name, stage)
        `)
        .eq('startup_id', id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ blueprints: data })
}

export async function POST(
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
        const { title, description, bounty_amount, required_skills } = body

        if (!title || !description || bounty_amount === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify user owns the startup
        const { data: startupData } = await supabase
            .from('startups')
            .select('founder_id')
            .eq('id', id)
            .single()

        if (startupData?.founder_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden. You do not own this startup.' }, { status: 403 })
        }

        const { data, error } = await supabase
            .from('blueprints')
            .insert({
                startup_id: id,
                title,
                description,
                bounty_amount,
                required_skills: required_skills || [],
                status: 'open'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ blueprint: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
