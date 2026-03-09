"use client"
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export function useJobSeekerStats() {
    const { user } = useAuth()
    const supabase = createClient()
    return useQuery({
        queryKey: ['dashboard-seeker', user?.id],
        queryFn: async () => {
            const [apps, interviews, views, connections] = await Promise.all([
                supabase.from("applications").select("*", { count: "exact", head: true }).eq("applicant_id", user!.id),
                supabase.from("applications").select("*", { count: "exact", head: true }).eq("applicant_id", user!.id).eq("status", "interview"),
                supabase.from("profiles").select("view_count").eq("user_id", user!.id).single(),
                supabase.from("followers").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
            ])
            return {
                applications: apps.count ?? 0,
                interviews: interviews.count ?? 0,
                profileViews: views.data?.view_count ?? 0,
                connections: connections.count ?? 0,
            }
        },
        enabled: !!user
    })
}

export function useFreelancerStats() {
    const { user } = useAuth()
    const supabase = createClient()
    return useQuery({
        queryKey: ['dashboard-freelancer', user?.id],
        queryFn: async () => {
            const [active, earned, services, rating] = await Promise.all([
                supabase.from("orders").select("*", { count: "exact", head: true }).eq("seller_id", user!.id).eq("status", "in_progress"),
                supabase.from("orders").select("amount_usdc").eq("seller_id", user!.id).eq("status", "completed"),
                supabase.from("services").select("*", { count: "exact", head: true }).eq("user_id", user!.id).eq("is_active", true),
                supabase.from("services").select("rating").eq("user_id", user!.id),
            ])
            const totalEarned = earned.data?.reduce((sum, o) => sum + (o.amount_usdc || 0), 0) ?? 0
            const avgRating = rating.data?.length ? (rating.data.reduce((s, r) => s + (r.rating || 0), 0) / rating.data.length).toFixed(1) : "—"
            return { activeOrders: active.count ?? 0, totalEarned, servicesListed: services.count ?? 0, avgRating }
        },
        enabled: !!user
    })
}

export function useFounderStats() {
    const { user } = useAuth()
    const supabase = createClient()
    return useQuery({
        queryKey: ['dashboard-founder', user?.id],
        queryFn: async () => {
            const [jobs, startups, blueprints] = await Promise.all([
                supabase.from("jobs").select("*", { count: "exact", head: true }).eq("founder_id", user!.id).eq("status", "open"),
                supabase.from("startups").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
                supabase.from("blueprints").select("*", { count: "exact", head: true }).eq("creator_id", user!.id),
            ])
            return { activeJobs: jobs.count ?? 0, startups: startups.count ?? 0, blueprintsCount: blueprints.count ?? 0 }
        },
        enabled: !!user
    })
}
