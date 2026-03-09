import { useQuery } from '@tanstack/react-query'
import { fetchBlueprints } from '@/lib/queries/blueprints'

export function useBlueprints() {
    return useQuery({
        queryKey: ['blueprints'],
        queryFn: fetchBlueprints
    })
}
