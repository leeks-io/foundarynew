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
    const { data: jobInfo } = await (supabase.from('jobs') as any).select('founder_id').eq('id', id).single()

    if (!jobInfo) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (jobInfo.founder_id !== user.id) {
        return NextResponse.json({ error: 'Action forbidden. Only the job owner can view applications.' }, { status: 403 })
    }

    const { data, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            applicant:profiles(id, username, full_name, avatar_url)
        `)
        .eq('job_id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications: data })
}
