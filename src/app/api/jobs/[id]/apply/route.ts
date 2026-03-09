import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

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
        const { cover_letter, resume_link } = body

        // Free tier enforcement logic
        // Only allow 2 job applications per 24 hours if not premium
        const { data: userData } = await supabase.from('users').select('is_premium').eq('id', user.id).single()

        if (!userData?.is_premium) {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            const { count } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('applicant_id', user.id)
                .gte('applied_at', twentyFourHoursAgo)

            if (count && count >= 2) {
                return NextResponse.json({ error: 'Daily limit reached. Upgrade to premium for unlimited applications.' }, { status: 429 })
            }
        }

        const { data, error } = await supabase
            .from('applications')
            .insert({
                job_id: id,
                applicant_id: user.id,
                cover_letter,
                resume_link
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return NextResponse.json({ error: 'You have already applied to this job.' }, { status: 409 })
            }
            throw error
        }

        return NextResponse.json({ application: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
