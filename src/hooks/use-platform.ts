"use client"

import { useSyncExternalStore } from "react"

export function usePlatform() {
    return useSyncExternalStore(
        () => () => {},
        () => {
            return document.documentElement.dataset.platform
        },
        () => {
            return null
        }
    )
}
