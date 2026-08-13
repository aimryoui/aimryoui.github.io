"use client"

import { ViewTransition as ReactViewTransition } from "react"

import { useEffectsStore } from "@/stores/effects-store"

type ViewTransitionProps = React.ComponentProps<typeof ReactViewTransition>

function ViewTransition({ children, ...props }: ViewTransitionProps) {
    const isEnabled = useEffectsStore((state) =>
        state.effects.includes("page-transition")
    )

    if (!isEnabled) {
        return children
    }

    return <ReactViewTransition {...props}>{children}</ReactViewTransition>
}

export type { ViewTransitionProps }
export { ViewTransition }
