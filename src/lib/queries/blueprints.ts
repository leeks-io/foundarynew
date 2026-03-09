import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export async function fetchBlueprints() {
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}
