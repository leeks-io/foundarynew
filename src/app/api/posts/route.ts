import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 50)
    const offset = parseInt(searchParams.get('offset') ?? '0')

    const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(id, username, full_name, avatar_url, role)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let body: any
    try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

    const { content, image_url } = body
    if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    if (content.length > 500) return NextResponse.json({ error: 'Content too long' }, { status: 400 })

    const { data, error } = await supabase
        .from('posts')
        .insert({ author_id: session.user.id, content: content.trim(), image_url: image_url ?? null })
        .select('*, profiles(id, username, full_name, avatar_url, role)')
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}
