import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    let query = supabase
        .from('services')
        .select(`
            *,
            freelancer:users(id, username, is_premium, builder_score)
        `)
        .order('created_at', { ascending: false })

    if (searchParams.get('category')) {
        query = query.eq('category', searchParams.get('category'))
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ services: data })
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role check - Only freelancers can post services
    const { data: userData } = await supabase.from('users').select('role, is_premium').eq('id', user.id).single()
    if (userData?.role !== 'freelancer') {
        return NextResponse.json({ error: 'Only freelancers can list services' }, { status: 403 })
    }

    // Free tier enforcement: Max 1 active service per free tier freelancer
    if (!userData?.is_premium) {
        const { count } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('freelancer_id', user.id)

        if (count && count >= 1) {
            return NextResponse.json({ error: 'Free tier permits only 1 active service listing. Please upgrade to premium.' }, { status: 402 })
        }
    }

    try {
        const body = await request.json()
        const { title, description, price, delivery_time_days, revisions, category, image_url } = body

        if (!title || !description || price === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('services')
            .insert({
                freelancer_id: user.id,
                title,
                description,
                price,
                delivery_time_days: delivery_time_days || 3,
                revisions: revisions || 1,
                category: category || 'General',
                image_url
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ service: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
