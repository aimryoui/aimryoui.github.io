import { useSyncExternalStore } from "react"

import theme from "@/lib/tailwindcss-plugins/tailwind"

interface UseMediaQueryOptions {
    getInitialValueInEffect: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped withCatalina and before) do not support
 * addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 *
 * @param {MediaQueryList} query Media query list
 * @param {MediaQueryCallback} callback Callback function
 * @returns {Function} Unmount function
 */
function attachMediaListener(
    query: MediaQueryList,
    callback: MediaQueryCallback
) {
    try {
        query.addEventListener("change", callback)
        return () => {
            query.removeEventListener("change", callback)
        }
    } catch (_e) {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        query.addListener(callback)
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            query.removeListener(callback)
        }
    }
}

function getInitialValue(query: string, initialValue?: boolean) {
    if (typeof initialValue === "boolean") {
        return initialValue
    }

    if (typeof window !== "undefined" && "matchMedia" in window) {
        return window.matchMedia(query).matches
    }

    return false
}

const defaultOptions: UseMediaQueryOptions = {
    getInitialValueInEffect: true
}

function breakpoint(size: keyof typeof theme.screens) {
    return theme.screens[size].max
}

const BREAKPOINTS = {
    "2xl": `(max-width: ${breakpoint("2xl")})`,
    xl: `(max-width: ${breakpoint("xl")})`,
    lg: `(max-width: ${breakpoint("lg")})`,
    md: `(max-width: ${breakpoint("md")})`,
    sm: `(max-width: ${breakpoint("sm")})`
} as const

type BreakpointKey = keyof typeof BREAKPOINTS

function useMediaQuery(
    query: BreakpointKey | (string & Record<never, never>),
    initialValue?: boolean,
    { getInitialValueInEffect }: UseMediaQueryOptions = defaultOptions
): boolean {
    const mediaQueryString =
        query in BREAKPOINTS ? BREAKPOINTS[query as BreakpointKey] : query

    const subscribe = (callback: () => void) => {
        try {
            const mediaQuery = window.matchMedia(mediaQueryString)
            return attachMediaListener(mediaQuery, callback)
        } catch (_e) {
            // Safari iframe compatibility issue
            return () => {}
        }
    }

    const getSnapshot = () => getInitialValue(mediaQueryString)

    const getServerSnapshot = () => initialValue ?? false

    const matches = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getInitialValueInEffect ? getServerSnapshot : getSnapshot
    )

    return matches
}

export type { BreakpointKey }
export { BREAKPOINTS, useMediaQuery }
