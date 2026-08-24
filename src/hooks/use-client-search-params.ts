"use client"

import { useMemo, useSyncExternalStore } from "react"

let isPatched = false

function patchHistory() {
    if (typeof window === "undefined" || isPatched) return
    isPatched = true

    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
        originalPushState.apply(this, args)
        setTimeout(() => {
            window.dispatchEvent(new Event("pushstate"))
        }, 0)
    }

    window.history.replaceState = function (...args) {
        originalReplaceState.apply(this, args)
        setTimeout(() => {
            window.dispatchEvent(new Event("replacestate"))
        }, 0)
    }
}

function subscribe(callback: () => void) {
    patchHistory()

    window.addEventListener("popstate", callback)
    window.addEventListener("pushstate", callback)
    window.addEventListener("replacestate", callback)

    return () => {
        window.removeEventListener("popstate", callback)
        window.removeEventListener("pushstate", callback)
        window.removeEventListener("replacestate", callback)
    }
}

function getSnapshot() {
    return window.location.search
}

function getServerSnapshot() {
    return ""
}

/**
 * A custom replacement for Next.js `useSearchParams` that does NOT bail out of
 * Static Site Generation (SSG). It listens to standard history events and
 * custom pushstate/replacestate events.
 *
 * @returns {URLSearchParams} A URLSearchParams instance representing the
 *   current query string.
 */
function useClientSearchParams() {
    const search = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )
    return useMemo(() => new URLSearchParams(search), [search])
}

export { useClientSearchParams }
