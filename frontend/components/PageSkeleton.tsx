"use client"


export default function PageSkeleton() {
    return (
        <div className="p-10">
            <div className="animate-pulse space-y-8">

                <div className="space-y-2">
                    <div className="h-8 w-40 bg-neutral-300 rounded-xl"></div>
                    <div className="h-8 w-64 bg-neutral-200 rounded-xl"></div>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="aspect-square w-full bg-neutral-200 rounded-xl" />

                            <div className="h-4 w-3/4 bg-neutral-200 rounded-md" />
                            <div className="h-4 w-1/4 bg-neutral-200 rounded-md" />

                            <div className="h-4 w-20 bg-neutral-300 rounded-md" />
                            <div className="h-8 w-full bg-neutral-300 rounded-md" />

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}