"use client"

import { ViewTransition as ReactViewTransition } from "react"

import { usePreference } from "@/hooks/use-preference"

type ViewTransitionProps = React.ComponentProps<typeof ReactViewTransition>

function ViewTransition({ children, ...props }: ViewTransitionProps) {
    const { effectPageTransition } = usePreference()

    if (!effectPageTransition) {
        return children
    }

    return <ReactViewTransition {...props}>{children}</ReactViewTransition>
}

export type { ViewTransitionProps }
export { ViewTransition }
