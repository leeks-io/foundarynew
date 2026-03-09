import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export async function fetchStartups() {
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export async function createStartup(userId: string, startupData: any) {
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase
        .from('startups')
        .insert({
            founder_id: userId,
            ...startupData
        })
        .select()
        .single()
    if (error) throw error
    return data
}
