"use client"

import { useSyncExternalStore } from "react"

function usePlatform() {
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

export { usePlatform }
