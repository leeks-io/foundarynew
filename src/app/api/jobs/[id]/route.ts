import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('jobs')
        .select(`
            *,
            founder:users(id, username, is_premium, builder_score)
        `)
        .eq('id', params.id)
        .single()

    if (error || !data) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({ job: data })
}

export async function PATCH(
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
        const { title, description, budget, status } = body

        // Only the founder who created the job can edit it
        const { data: jobInfo } = await supabase.from('jobs').select('founder_id').eq('id', params.id).single()
        if (jobInfo?.founder_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updates: any = { updated_at: new Date().toISOString() }
        if (title) updates.title = title
        if (description) updates.description = description
        if (budget) updates.budget = budget
        if (status) updates.status = status // e.g. 'open', 'closed', 'in_progress'

        const { data, error } = await supabase
            .from('jobs')
            .update(updates)
            .eq('id', params.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ job: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only the founder who created the job can delete it
    const { data: jobInfo } = await supabase.from('jobs').select('founder_id').eq('id', params.id).single()
    if (jobInfo?.founder_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', params.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
