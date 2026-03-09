export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    username: string
                    wallet_address: string | null
                    role: 'jobseeker' | 'freelancer' | 'founder'
                    is_premium: boolean
                    builder_score: number
                    referral_code: string | null
                    referred_by: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    username: string
                    wallet_address?: string | null
                    role?: 'jobseeker' | 'freelancer' | 'founder'
                    is_premium?: boolean
                    builder_score?: number
                    referral_code?: string | null
                    referred_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    username?: string
                    wallet_address?: string | null
                    role?: 'jobseeker' | 'freelancer' | 'founder'
                    is_premium?: boolean
                    builder_score?: number
                    referral_code?: string | null
                    referred_by?: string | null
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    user_id: string
                    bio: string | null
                    skills: string[] | null
                    portfolio_links: Json
                    social_links: Json
                    resume_url: string | null
                    profile_image: string | null
                    banner_image: string | null
                    build_in_public: boolean
                    verified: boolean
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    bio?: string | null
                    skills?: string[] | null
                    portfolio_links?: Json
                    social_links?: Json
                    resume_url?: string | null
                    profile_image?: string | null
                    banner_image?: string | null
                    build_in_public?: boolean
                    verified?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    bio?: string | null
                    skills?: string[] | null
                    portfolio_links?: Json
                    social_links?: Json
                    resume_url?: string | null
                    profile_image?: string | null
                    banner_image?: string | null
                    build_in_public?: boolean
                    verified?: boolean
                    updated_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string
                    category: string
                    price_usdc: number
                    delivery_days: number
                    tiers: Json
                    images: string[]
                    rating: number
                    orders_completed: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description: string
                    category: string
                    price_usdc: number
                    delivery_days: number
                    tiers?: Json
                    images?: string[]
                    rating?: number
                    orders_completed?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string
                    category?: string
                    price_usdc?: number
                    delivery_days?: number
                    tiers?: Json
                    images?: string[]
                    rating?: number
                    orders_completed?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            jobs: {
                Row: {
                    id: string
                    founder_id: string
                    title: string
                    description: string
                    budget: number | null
                    job_type: 'fulltime' | 'parttime' | 'contract' | 'gig'
                    is_remote: boolean
                    skills_required: string[]
                    status: 'open' | 'closed' | 'filled'
                    created_at: string
                }
                Insert: {
                    id?: string
                    founder_id: string
                    title: string
                    description: string
                    budget?: number | null
                    job_type: 'fulltime' | 'parttime' | 'contract' | 'gig'
                    is_remote?: boolean
                    skills_required?: string[]
                    status?: 'open' | 'closed' | 'filled'
                    created_at?: string
                }
                Update: {
                    id?: string
                    founder_id?: string
                    title?: string
                    description?: string
                    budget?: number | null
                    job_type?: 'fulltime' | 'parttime' | 'contract' | 'gig'
                    is_remote?: boolean
                    skills_required?: string[]
                    status?: 'open' | 'closed' | 'filled'
                    created_at?: string
                }
            }
            // Add other tables as needed based on common usage
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'jobseeker' | 'freelancer' | 'founder'
            job_type: 'fulltime' | 'parttime' | 'contract' | 'gig'
            job_status: 'open' | 'closed' | 'filled'
            application_status: 'pending' | 'viewed' | 'interview' | 'accepted' | 'rejected'
            order_status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'disputed' | 'refunded'
            startup_stage: 'idea' | 'mvp' | 'revenue' | 'growth'
            post_type: 'update' | 'blueprint_share' | 'job_share' | 'milestone'
            transaction_type: 'premium' | 'service_payment' | 'escrow_lock' | 'escrow_release' | 'blueprint_purchase'
            transaction_status: 'pending' | 'confirmed' | 'failed'
            community_role: 'member' | 'moderator' | 'admin'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
