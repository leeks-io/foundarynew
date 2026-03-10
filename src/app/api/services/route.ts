import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    let query = supabase
        .from('services')
        .select(`
            *,
            profiles:profiles(id, username, full_name, avatar_url, role)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (searchParams.get('category')) {
        query = query.eq('category', searchParams.get('category'))
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Role check - Only freelancers can post services
    const { data: profile } = await supabase.from('profiles').select('role, is_premium').eq('id', session.user.id).single()
    if (profile?.role !== 'freelancer') {
        return NextResponse.json({ error: 'Only freelancers can list services' }, { status: 403 })
    }

    // Free tier enforcement: Max 1 active service per free tier freelancer
    if (!profile?.is_premium) {
        const { count } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', session.user.id)
            .eq('is_active', true)

        if (count && count >= 1) {
            return NextResponse.json({ error: 'Free tier permits only 1 active service listing. Please upgrade to premium.' }, { status: 402 })
        }
    }

    try {
        const body = await request.json()
        const { title, description, price, delivery_days, category, tags } = body

        if (!title || !description || price === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('services')
            .insert({
                seller_id: session.user.id,
                title,
                description,
                price: Number(price),
                delivery_days: Number(delivery_days) || 3,
                category: category || null,
                tags: tags || [],
                is_active: true
            })
            .select('*, profiles:profiles(id, username, full_name, avatar_url, role)')
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
