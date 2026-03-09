import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns this job
    const { data: jobInfo } = await supabase.from('jobs').select('founder_id').eq('id', id).single()

    if (!jobInfo) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (jobInfo.founder_id !== user.id) {
        return NextResponse.json({ error: 'Action forbidden. Only the job owner can view applications.' }, { status: 403 })
    }

    const { data, error } = await supabase
        .from('applications')
        .select(`
            *,
            applicant:users(id, username, is_premium, builder_score),
            profile:profiles!inner(bio, skills, portfolio_links)
        `)
        .eq('job_id', id)
        // Manual join trick since applicant_id matches profiles.user_id
        .eq('profiles.user_id', 'applicant.id') // Handled by Supabase relationships if foreign keys are correct

    if (error) {
        // Fallback simpler query if foreign key pathing fails above
        const { data: simpleData, error: simpleError } = await supabase
            .from('applications')
            .select(`
                *,
                applicant:users(id, username, is_premium, builder_score)
            `)
            .eq('job_id', id)

        if (simpleError) return NextResponse.json({ error: simpleError.message }, { status: 500 })
        return NextResponse.json({ applications: simpleData })
    }

    return NextResponse.json({ applications: data })
}
