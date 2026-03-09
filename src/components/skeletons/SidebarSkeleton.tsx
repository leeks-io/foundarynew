export function SidebarSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-4">
                <div className="h-5 bg-[#1a1a1a] rounded w-1/3 mb-4" />
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
                        <div className="h-3 bg-[#1a1a1a] rounded w-1/3" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
                        <div className="h-3 bg-[#1a1a1a] rounded w-1/3" />
                    </div>
                </div>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-4">
                <div className="h-5 bg-[#1a1a1a] rounded w-1/3 mb-4" />
                <div className="h-4 bg-[#1a1a1a] rounded w-full" />
                <div className="h-4 bg-[#1a1a1a] rounded w-4/5" />
            </div>
        </div>
    )
}
