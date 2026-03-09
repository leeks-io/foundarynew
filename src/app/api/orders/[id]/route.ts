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
        const { status } = body // 'pending', 'in_progress', 'completed', 'disputed', 'cancelled'

        if (!['pending', 'in_progress', 'completed', 'disputed', 'cancelled'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        // Get the order to find the service_id
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('service_id, buyer_id')
            .eq('id', id)
            .single()

        if (orderError || !orderData) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Verify the user is either the freelancer OR the buyer
        const { data: serviceData } = await supabase
            .from('services')
            .select('freelancer_id')
            .eq('id', orderData.service_id)
            .single()

        const isFreelancer = serviceData?.freelancer_id === user.id
        const isBuyer = orderData.buyer_id === user.id

        if (!isFreelancer && !isBuyer) {
            return NextResponse.json({ error: 'Forbidden. You do not have permission to modify this order.' }, { status: 403 })
        }

        // Buyers can only move status to 'completed' or 'disputed' or invoke a cancel (subject to contract)
        if (isBuyer && !isFreelancer) {
            if (status !== 'completed' && status !== 'disputed' && status !== 'cancelled') {
                return NextResponse.json({ error: 'Buyers can only complete, dispute, or cancel orders.' }, { status: 403 })
            }
        }

        // Freelancers can move status to 'in_progress' or 'cancelled' or invoke 'disputed'
        if (isFreelancer && !isBuyer) {
            if (status === 'completed') {
                return NextResponse.json({ error: 'Only buyers can verify successful completion.' }, { status: 403 })
            }
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ order: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
