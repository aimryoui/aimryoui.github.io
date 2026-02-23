"use client"

import { useSyncExternalStore } from "react"

export function usePlatform() {
    return useSyncExternalStore(
        () => () => {
            // Empty
        },
        () => {
            return document.documentElement.dataset.platform
        },
        () => {
            return null
        }
    )
}
