import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    let query = supabase
        .from('jobs')
        .select(`
            *,
            profiles:profiles(id, username, full_name, avatar_url, role)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (searchParams.get('type')) {
        query = query.eq('type', searchParams.get('type'))
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Role check - Only founders can post jobs
    const { data: profile } = await (supabase.from('profiles') as any).select('role, is_premium').eq('id', session.user.id).single()
    if (!profile || (profile as any).role !== 'founder') {
        return NextResponse.json({ error: 'Only founders can post jobs' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { title, description, company, location, type, salary_min, salary_max, currency, skills, is_remote } = body

        if (!title || !description || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await (supabase
            .from('jobs') as any)
            .insert({
                founder_id: session.user.id,
                title,
                description,
                company: company || null,
                location: location || null,
                type,
                salary_min: Number(salary_min) || null,
                salary_max: Number(salary_max) || null,
                currency: currency || 'USD',
                skills: skills || [],
                is_remote: is_remote ?? true,
                is_active: true
            })
            .select('*, profiles:profiles(id, username, full_name, avatar_url, role)')
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
