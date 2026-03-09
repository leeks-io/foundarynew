export function PostSkeleton() {
    return (
        <div className="p-4 border-b border-[#1a1a1a] animate-pulse">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 bg-[#1a1a1a] rounded w-24" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-16" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-[#1a1a1a] rounded w-full" />
                        <div className="h-3 bg-[#1a1a1a] rounded w-4/5" />
                    </div>
                    <div className="flex justify-between max-w-sm pt-2">
                        <div className="h-4 bg-[#1a1a1a] rounded w-8" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-8" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-8" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}
