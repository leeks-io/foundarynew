"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchServices } from '@/lib/queries/services'

export function useServices(category?: string, sortBy?: string) {
    return useQuery({
        queryKey: ['services', category, sortBy],
        queryFn: () => fetchServices(category, sortBy),
    })
}
