export function ServiceSkeleton() {
    return (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl overflow-hidden animate-pulse">
            <div className="h-48 bg-[#1a1a1a]" />
            <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a]" />
                    <div className="h-3 bg-[#1a1a1a] rounded w-20" />
                </div>
                <div className="h-5 bg-[#1a1a1a] rounded w-full" />
                <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-[#1a1a1a] rounded w-12" />
                    <div className="h-6 bg-[#1a1a1a] rounded w-20" />
                </div>
            </div>
        </div>
    )
}
