import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createSupabaseBrowserClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// Alias — keeps all existing context/component files working without changes
export const createClient = createSupabaseBrowserClient
