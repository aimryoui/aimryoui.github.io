"use client"

import {
    type AppProgressProviderProps,
    Bar,
    Progress as BProgress,
    type ProgressProps as BProgressProps
} from "@bprogress/next"
import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app"

import { cn } from "@/lib/utils"

function RouteProgressProvider({
    options,
    shallowRouting = true,
    startOnLoad = true,
    ...props
}: AppProgressProviderProps) {
    return (
        <AppProgressProvider
            disableStyle
            options={{ showSpinner: false, template: null, ...options }}
            shallowRouting={shallowRouting}
            startOnLoad={startOnLoad}
            {...props}
        />
    )
}

function RouteProgress({ className, children, ...props }: BProgressProps) {
    return (
        <BProgress
            data-slot="progress"
            className={cn(
                "absolute inset-x-0 -top-px z-50 h-0.75 w-full overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
            <Bar
                data-slot="progress-bar"
                role="progressbar"
                className={cn("size-full bg-highlighted", {
                    "motion-reduced":
                        "!transform-[translate3d(0,0,0)] !transition-none"
                })}
            />
        </BProgress>
    )
}

export { RouteProgress, RouteProgressProvider }
