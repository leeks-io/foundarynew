import { createClient } from '@/lib/supabase/client'

export async function fetchBlueprints() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}
