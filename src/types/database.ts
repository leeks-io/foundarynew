export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    bio: string | null
                    role: 'founder' | 'freelancer' | 'jobseeker' | 'investor' | null
                    skills: string[]
                    location: string | null
                    website: string | null
                    twitter: string | null
                    linkedin: string | null
                    github: string | null
                    is_premium: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>
            }
            posts: {
                Row: {
                    id: string
                    author_id: string
                    content: string
                    image_url: string | null
                    likes_count: number
                    comments_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['posts']['Insert']>
            }
            post_likes: {
                Row: { post_id: string; user_id: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['post_likes']['Row'], 'created_at'>
                Update: never
            }
            post_comments: {
                Row: { id: string; post_id: string; author_id: string; content: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['post_comments']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['post_comments']['Insert']>
            }
            jobs: {
                Row: {
                    id: string
                    poster_id: string
                    title: string
                    description: string
                    company: string | null
                    location: string | null
                    type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
                    salary_min: number | null
                    salary_max: number | null
                    currency: string
                    skills: string[]
                    is_remote: boolean
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['jobs']['Insert']>
            }
            job_applications: {
                Row: { id: string; job_id: string; applicant_id: string; message: string | null; status: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['job_applications']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['job_applications']['Insert']>
            }
            services: {
                Row: {
                    id: string
                    seller_id: string
                    title: string
                    description: string
                    category: string | null
                    price: number
                    currency: string
                    delivery_days: number
                    tags: string[]
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['services']['Insert']>
            }
            service_orders: {
                Row: { id: string; service_id: string | null; buyer_id: string; seller_id: string; amount: number; status: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['service_orders']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['service_orders']['Insert']>
            }
            startups: {
                Row: {
                    id: string
                    founder_id: string
                    name: string
                    tagline: string | null
                    description: string | null
                    logo_url: string | null
                    website: string | null
                    stage: 'idea' | 'mvp' | 'seed' | 'series-a' | 'growth'
                    industry: string | null
                    looking_for: string[]
                    is_public: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['startups']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['startups']['Insert']>
            }
            blueprints: {
                Row: {
                    id: string
                    author_id: string
                    title: string
                    description: string | null
                    content: string | null
                    category: string | null
                    tags: string[]
                    is_premium: boolean
                    price: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['blueprints']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['blueprints']['Insert']>
            }
            communities: {
                Row: {
                    id: string
                    creator_id: string
                    name: string
                    description: string | null
                    avatar_url: string | null
                    category: string | null
                    member_count: number
                    is_public: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['communities']['Row'], 'id' | 'member_count' | 'created_at'>
                Update: Partial<Database['public']['Tables']['communities']['Insert']>
            }
            community_members: {
                Row: { community_id: string; user_id: string; role: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['community_members']['Row'], 'created_at'>
                Update: never
            }
            connections: {
                Row: { id: string; requester_id: string; recipient_id: string; status: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['connections']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['connections']['Insert']>
            }
            conversations: {
                Row: { id: string; participant_1: string; participant_2: string; last_message_at: string; created_at: string }
                Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['conversations']['Insert']>
            }
            messages: {
                Row: { id: string; conversation_id: string; sender_id: string; content: string; is_read: boolean; created_at: string }
                Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'is_read' | 'created_at'>
                Update: Partial<Database['public']['Tables']['messages']['Insert']>
            }
            notifications: {
                Row: { id: string; user_id: string; type: string; title: string; body: string | null; is_read: boolean; data: Json; created_at: string }
                Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'is_read' | 'created_at'>
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
    }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Startup = Database['public']['Tables']['startups']['Row']
export type Blueprint = Database['public']['Tables']['blueprints']['Row']
export type Community = Database['public']['Tables']['communities']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Connection = Database['public']['Tables']['connections']['Row']

export type PostWithAuthor = Post & { profiles: Profile }
export type JobWithPoster = Job & { profiles: Profile }
export type ServiceWithSeller = Service & { profiles: Profile }
export type StartupWithFounder = Startup & { profiles: Profile }
export type BlueprintWithAuthor = Blueprint & { profiles: Profile }
export type CommunityWithCreator = Community & { profiles: Profile }
