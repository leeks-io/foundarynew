import { useQuery } from '@tanstack/react-query'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export function useBuilders(limit = 6) {
    const supabase = createSupabaseBrowserClient()
    return useQuery({
        queryKey: ['builders', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('users')
                .select('username, role, builder_score, profiles(profile_image), skills')
                .order('builder_score', { ascending: false })
                .limit(limit)
            if (error) throw error
            return data
        }
    })
}
