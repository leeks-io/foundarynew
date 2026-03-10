import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()

    const { data: profile, error } = await (supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single() as any)

    if (error || !profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
}
