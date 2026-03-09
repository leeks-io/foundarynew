export function EmptyJobs() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-white font-bold text-xl mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Be the first to post a job on Foundry.</p>
            <button className="bg-[#07DA63] text-black px-6 py-2 rounded-lg font-bold">
                Post a Job
            </button>
        </div>
    )
}
