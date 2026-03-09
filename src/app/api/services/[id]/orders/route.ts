import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns this service
    const { data: serviceInfo } = await supabase.from('services').select('freelancer_id').eq('id', params.id).single()

    if (!serviceInfo) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    if (serviceInfo.freelancer_id !== user.id) {
        return NextResponse.json({ error: 'Action forbidden. Only the service owner can view orders.' }, { status: 403 })
    }

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            buyer:users(id, username, is_premium, builder_score)
        `)
        .eq('service_id', params.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: data })
}
