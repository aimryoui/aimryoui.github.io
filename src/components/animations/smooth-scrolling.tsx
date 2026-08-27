"use client"

import "lenis/dist/lenis.css"

import { type LenisRef, ReactLenis } from "lenis/react"

import { usePreference } from "@/hooks/use-preference"
import { useSmoothScrollingStore } from "@/stores/smooth-scrolling-store"

type SmoothScrollingProps = Omit<
    React.ComponentProps<typeof ReactLenis>,
    "ref"
> & {
    ref?: React.Ref<LenisRef | HTMLDivElement>
}

function SmoothScrolling({
    children,
    root,
    className,
    options,
    ref,
    ...props
}: SmoothScrollingProps) {
    const isSmoothScrollingEnabled = useSmoothScrollingStore(
        (state) => state.isSmoothScrollingEnabled
    )
    const { motionReduced } = usePreference()

    const isEnabled = isSmoothScrollingEnabled && !motionReduced

    if (!isEnabled) {
        if (root) return null
        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                className={className}
                {...props}
            >
                {children}
            </div>
        )
    }

    return (
        <ReactLenis
            root={root}
            options={options}
            className={className}
            ref={ref as React.Ref<LenisRef>}
            {...props}
        >
            {children}
        </ReactLenis>
    )
}

export { SmoothScrolling }
