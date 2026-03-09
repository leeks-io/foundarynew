"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchJobs, JobFilters } from '@/lib/queries/jobs'

export function useJobs(filters: JobFilters = {}) {
    return useQuery({
        queryKey: ['jobs', filters],
        queryFn: () => fetchJobs(filters),
    })
}
