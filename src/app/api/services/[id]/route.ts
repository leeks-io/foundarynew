import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('services')
        .select(`
            *,
            freelancer:users(id, username, is_premium, builder_score)
        `)
        .eq('id', id)
        .single()

    if (error || !data) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ service: data })
}

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
        const { title, description, price, delivery_time_days, revisions, category, image_url, is_active } = body

        // Only the freelancer who created the service can edit it
        const { data: serviceInfo } = await (supabase.from('services').select('seller_id').eq('id', id).single() as any)
        if (serviceInfo?.seller_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updates: any = { updated_at: new Date().toISOString() }
        if (title !== undefined) updates.title = title
        if (description !== undefined) updates.description = description
        if (price !== undefined) updates.price = price
        if (delivery_time_days !== undefined) updates.delivery_time_days = delivery_time_days
        if (revisions !== undefined) updates.revisions = revisions
        if (category !== undefined) updates.category = category
        if (image_url !== undefined) updates.image_url = image_url
        if (is_active !== undefined) updates.is_active = is_active

        const { data, error } = await (supabase
            .from('services') as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ service: data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only the freelancer who created the service can delete it
    const { data: serviceInfo } = await (supabase.from('services').select('seller_id').eq('id', id).single() as any)
    if (serviceInfo?.seller_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
