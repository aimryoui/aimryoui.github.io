"use client"

import { ReactLenis } from "lenis/react"

import { usePreference } from "@/hooks/use-preference"
import { useSmoothScrollingStore } from "@/stores/smooth-scrolling-store"

type SmoothScrollingProps = React.ComponentProps<typeof ReactLenis>

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
            <div className={className} {...props}>
                {children}
            </div>
        )
    }

    return (
        <ReactLenis
            root={root}
            options={options}
            className={className}
            ref={ref}
            {...props}
        >
            {children}
        </ReactLenis>
    )
}

export { SmoothScrolling }
