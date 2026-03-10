import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { message } = body

        // Daily limit for free tier
        const { data: profile } = await (supabase.from('profiles').select('is_premium').eq('id', session.user.id).single() as any)

        if (!profile?.is_premium) {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            const { count } = await (supabase
                .from('job_applications') as any)
                .select('*', { count: 'exact', head: true })
                .eq('applicant_id', session.user.id)
                .gte('created_at', twentyFourHoursAgo)

            if (count && count >= 2) return NextResponse.json({ error: 'Daily limit reached.' }, { status: 429 })
        }

        const { data, error } = await (supabase
            .from('job_applications') as any)
            .insert({
                job_id: id,
                applicant_id: session.user.id,
                message: message || null,
                status: 'pending'
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') return NextResponse.json({ error: 'Already applied' }, { status: 409 })
            throw error
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
