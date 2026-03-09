import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

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
        const { status } = body // 'pending', 'accepted', 'rejected'

        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        // Get the application to find the job_id
        const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('job_id')
            .eq('id', id)
            .single()

        if (appError || !appData) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Verify the user is the founder of the job
        const { data: jobData } = await supabase
            .from('jobs')
            .select('founder_id')
            .eq('id', appData.job_id)
            .single()

        if (jobData?.founder_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden. You do not own this job listing.' }, { status: 403 })
        }

        const { data, error } = await supabase
            .from('applications')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ application: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
