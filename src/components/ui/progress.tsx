"use client"

import { Bar, Progress as BProgress, type ProgressProps } from "@bprogress/next"

import { cn } from "@/lib/utils"

function Progress({ className, ...props }: ProgressProps) {
    return (
        <BProgress
            data-slot="progress"
            className={cn(
                "absolute inset-x-0 -top-px z-50 h-0.75 w-full overflow-hidden",
                className
            )}
            {...props}
        >
            <Bar
                data-slot="progress-bar"
                role="progressbar"
                className={cn("size-full bg-highlighted")}
            />
        </BProgress>
    )
}

export { Progress }
