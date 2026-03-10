import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { role } = body

        if (!['founder', 'freelancer', 'jobseeker', 'investor'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role provided' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', session.user.id)
            .select('role')
            .single()

        if (error) throw error

        return NextResponse.json({ role: data.role })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
