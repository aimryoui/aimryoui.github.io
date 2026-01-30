"use client"

import { useSyncExternalStore } from "react"

export function usePlatform() {
    return useSyncExternalStore(
        () => () => {
            // Empty
        },
        () => {
            return document.documentElement.getAttribute("data-platform")
        },
        () => {
            return null
        }
    )
}
