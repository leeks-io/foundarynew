import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { role } = body // 'jobseeker', 'freelancer', or 'founder'

        if (!['jobseeker', 'freelancer', 'founder'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role provided' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', user.id)
            .select('role')
            .single()

        if (error) throw error

        return NextResponse.json({ role: data.role })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
