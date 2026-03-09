import { useQuery } from '@tanstack/react-query'
import { fetchStartups } from '@/lib/queries/startups'

export function useStartups() {
    return useQuery({
        queryKey: ['startups'],
        queryFn: fetchStartups
    })
}
