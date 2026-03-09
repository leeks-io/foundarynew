import { createClient } from '@/lib/supabase/client'

export async function fetchServices(category?: string, sortBy?: string) {
    const supabase = createClient()
    let q = supabase
        .from('services')
        .select(`*, users:user_id(id, username, is_premium, profiles(profile_image))`)
        .eq('is_active', true)

    if (category && category !== 'All') q = q.eq('category', category)

    if (sortBy === 'price_asc') q = q.order('price_usdc', { ascending: true })
    else if (sortBy === 'rating') q = q.order('rating', { ascending: false })
    else q = q.order('orders_completed', { ascending: false }) // Trending/Popularity

    const { data, error } = await q
    if (error) throw error
    return data
}
