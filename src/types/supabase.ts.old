export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    created_at: string
                    username: string | null
                    role: string | null
                    is_premium: boolean
                    builder_score: number
                    follower_count: number
                }
                Insert: {
                    id: string
                    username?: string | null
                    role?: string | null
                    is_premium?: boolean
                    builder_score?: number
                }
                Update: {
                    username?: string | null
                    role?: string | null
                    is_premium?: boolean
                    builder_score?: number
                }
            }
            profiles: {
                Row: {
                    user_id: string
                    bio: string | null
                    skills: string[] | null
                    portfolio_links: any | null
                    social_links: any | null
                    profile_image: string | null
                    banner_image: string | null
                    view_count: number
                }
            }
            posts: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    media_urls: string[] | null
                    post_type: string
                    likes_count: number
                    replies_count: number
                    created_at: string
                }
            }
            jobs: {
                Row: {
                    id: string
                    founder_id: string
                    title: string
                    company_name: string
                    description: string | null
                    budget: number
                    is_remote: boolean
                    job_type: string
                    status: string
                    created_at: string
                }
            }
            services: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    price_usdc: number
                    delivery_days: number
                    category: string
                    images: string[] | null
                    rating: number
                    orders_completed: number
                    is_active: boolean
                    created_at: string
                }
            }
            orders: {
                Row: {
                    id: string
                    service_id: string
                    buyer_id: string
                    seller_id: string
                    amount_usdc: number
                    status: string
                    transaction_hash: string | null
                    buyer_approved: boolean
                    created_at: string
                }
            }
            applications: {
                Row: {
                    id: string
                    job_id: string
                    applicant_id: string
                    status: string
                    cover_letter: string | null
                    applied_at: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    message: string
                    is_read: boolean
                    created_at: string
                }
            }
            followers: {
                Row: {
                    user_id: string
                    follower_id: string
                    created_at: string
                }
            }
            blueprints: {
                Row: {
                    id: string
                    creator_id: string
                    title: string
                    description: string | null
                    price_usdc: number
                    category: string
                    industry: string | null
                    metrics: any | null
                    created_at: string
                }
            }
        }
    }
}
