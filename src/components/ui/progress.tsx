"use client"

import { createContext, useContext, useMemo } from "react"

import { Bar, Progress as BProgress, type ProgressProps } from "@bprogress/next"
import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app"
import {
    Label as LabelPrimitive,
    type LabelProps
} from "react-aria-components/Label"
import {
    ProgressBar as ProgressPrimitive,
    type ProgressBarProps as ProgressPrimitiveProps
} from "react-aria-components/ProgressBar"

import { cn } from "@/lib/utils"

interface ProgressContextValue {
    percentage?: number
    isIndeterminate: boolean
    valueText?: string
}
const ProgressContext = createContext<ProgressContextValue | null>(null)

function useProgress() {
    const context = useContext(ProgressContext)
    if (!context) {
        throw new Error("useProgress must be used within a Progress.")
    }
    return context
}

function ProgressContent({
    children,
    percentage,
    isIndeterminate,
    valueText
}: ProgressContextValue & {
    children?: React.ReactNode
}) {
    const context = useMemo(
        () => ({ percentage, isIndeterminate, valueText }),
        [percentage, isIndeterminate, valueText]
    )
    return (
        <ProgressContext value={context}>
            {children}
            <ProgressTrack>
                <ProgressIndicator />
            </ProgressTrack>
        </ProgressContext>
    )
}

function Progress({
    className,
    children,
    ...props
}: Omit<ProgressPrimitiveProps, "children" | "className"> & {
    children?: React.ReactNode
    className?: string
}) {
    return (
        <ProgressPrimitive
            data-slot="progress"
            className={cn("flex flex-wrap gap-3", className)}
            {...props}
        >
            {({ percentage, valueText, isIndeterminate }) => (
                <ProgressContent
                    percentage={percentage}
                    valueText={valueText}
                    isIndeterminate={isIndeterminate}
                >
                    {children}
                </ProgressContent>
            )}
        </ProgressPrimitive>
    )
}

function ProgressTrack({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
                className
            )}
            data-slot="progress-track"
            {...props}
        />
    )
}

function ProgressIndicator({
    className,
    style,
    ...props
}: React.ComponentProps<"span">) {
    const { percentage, isIndeterminate } = useProgress()
    return (
        <span
            data-slot="progress-indicator"
            className={cn("h-full bg-primary transition-all", className)}
            style={{
                ...style,
                width: `${isIndeterminate ? 100 : (percentage ?? 0)}%`
            }}
            {...props}
        />
    )
}

function ProgressLabel({ className, ...props }: LabelProps) {
    return (
        <LabelPrimitive
            className={cn("text-sm font-wght-600", className)}
            data-slot="progress-label"
            {...props}
        />
    )
}

function ProgressValue({
    className,
    children,
    ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
    children?: (value: string) => React.ReactNode
}) {
    const { valueText } = useProgress()
    return (
        <span
            className={cn(
                "ml-auto text-sm tabular-nums text-muted-foreground",
                className
            )}
            data-slot="progress-value"
            {...props}
        >
            {children && valueText !== undefined
                ? children(valueText)
                : valueText}
        </span>
    )
}

function ProgressRouteProvider({ children }: { children: React.ReactNode }) {
    return (
        <AppProgressProvider
            disableStyle
            options={{ showSpinner: false, template: null }}
            shallowRouting
            startOnLoad
        >
            {children}
        </AppProgressProvider>
    )
}

function ProgressRoute({ className, ...props }: ProgressProps) {
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

export {
    Progress,
    ProgressContent,
    ProgressIndicator,
    ProgressLabel,
    ProgressRoute,
    ProgressRouteProvider,
    ProgressTrack,
    ProgressValue
}
