import { createClient } from '@/lib/supabase/client'

export async function fetchProfile(username: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('users')
        .select(`
      id, username, role, is_premium, builder_score,
      profiles(bio, skills, portfolio_links, social_links, profile_image, banner_image, view_count),
      services(id, title, price_usdc, rating, orders_completed, is_active),
      startups(id, name, industry, stage, metrics),
      followers!user_id(count)
    `)
        .eq("username", username)
        .single()

    if (error) throw error
    return data
}

export async function updateProfile(userId: string, updates: any) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}
