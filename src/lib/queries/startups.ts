import { createClient } from '@/lib/supabase/client'

export async function fetchStartups() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export async function createStartup(userId: string, startupData: any) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('startups')
        .insert({
            user_id: userId,
            ...startupData
        })
        .select()
        .single()
    if (error) throw error
    return data
}
