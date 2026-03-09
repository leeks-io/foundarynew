import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // pagination setup placeholder
    // const page = parseInt(searchParams.get('page') || '1')
    // const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
        .from('jobs')
        .select(`
            *,
            founder:users(id, username, is_premium, builder_score)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })

    // Optional filters can be added here
    if (searchParams.get('type')) {
        query = query.eq('job_type', searchParams.get('type'))
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ jobs: data })
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role check - Only founders can post jobs
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userData?.role !== 'founder') {
        return NextResponse.json({ error: 'Only founders can post jobs' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { title, description, budget, job_type, is_remote, skills_required } = body

        if (!title || !description || !job_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('jobs')
            .insert({
                founder_id: user.id,
                title,
                description,
                budget,
                job_type,
                is_remote: is_remote ?? true,
                skills_required: skills_required || []
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ job: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
