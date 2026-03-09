import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
    const supabase = createSupabaseBrowserClient()
    const ext = file.name.split(".").pop()
    const path = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, {
        upsert: true, contentType: file.type
    })
    if (error) throw error

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    // Save URL to profile
    await supabase.from('profiles').update({ profile_image: data.publicUrl }).eq('user_id', userId)
    return data.publicUrl
}

export async function uploadServiceImage(serviceId: string, file: File): Promise<string> {
    const supabase = createSupabaseBrowserClient()
    const path = `${serviceId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('service-images').upload(path, file, { upsert: false })
    if (error) throw error

    const { data } = supabase.storage.from("service-images").getPublicUrl(path)
    return data.publicUrl
}

export async function uploadDelivery(orderId: string, file: File): Promise<string> {
    const supabase = createSupabaseBrowserClient()
    const path = `${orderId}/${file.name}`
    const { error } = await supabase.storage.from('order-deliveries').upload(path, file, { upsert: false })
    if (error) throw error

    // Get signed URL (assuming order-deliveries is a private bucket)
    const { data, error: signedError } = await supabase.storage.from("order-deliveries").createSignedUrl(path, 86400)
    if (signedError) throw signedError

    return data.signedUrl
}
