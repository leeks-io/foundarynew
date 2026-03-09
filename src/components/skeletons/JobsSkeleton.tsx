export function JobsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 animate-pulse">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#1a1a1a] rounded w-1/3" />
                            <div className="h-3 bg-[#1a1a1a] rounded w-1/2" />
                            <div className="h-3 bg-[#1a1a1a] rounded w-1/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
