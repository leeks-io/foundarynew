import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export type JobFilters = {
    search?: string
    type?: string
    remote?: boolean
    skills?: string[]
}

export async function fetchJobs(filters: JobFilters = {}) {
    const supabase = createSupabaseBrowserClient()
    let query = supabase
        .from('jobs')
        .select(`
      *, users:founder_id(id, username, is_premium,
        profiles(profile_image))
    `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })

    if (filters.search) query = query.ilike('title', `%${filters.search}%`)
    if (filters.type && filters.type !== 'All') query = query.eq('job_type', filters.type)
    if (filters.remote !== undefined) query = query.eq('is_remote', filters.remote)

    const { data, error } = await query
    if (error) throw error
    return data
}

export async function fetchJobById(id: string) {
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase
        .from('jobs')
        .select(`*, users:founder_id(id, username, is_premium, profiles(profile_image, bio))`)
        .eq("id", id).single()
    if (error) throw error
    return data
}
