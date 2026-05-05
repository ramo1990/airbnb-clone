"use client"


export default function Skeleton() {
    return (
        <div className="animate-pulse max-w-5xl mx-auto p-4 flex flex-col gap-8">
            
            <div className="h-8 w-1/3 bg-neutral-300 rounded-md" />

            <div className="w-full h-[60vh] bg-neutral-300 rounded-xl" /> 

            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-300" />
                    <div className="h-5 w-1/4 bg-neutral-300 rounded-md" />
                </div>

                <div className="flex text-neutral-500 gap-4">
                    <div className="h-4 w-20 rounded-md bg-neutral-300" />
                    <div className="h-4 w-20 rounded-md bg-neutral-300" />
                    <div className="h-4 w-20 rounded-md bg-neutral-300" />
                </div>
            </div>
        </div>
    )
}