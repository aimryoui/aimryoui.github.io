import { useEffect, useState } from "react"

export interface UseMediaQueryOptions {
    getInitialValueInEffect: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped withCatalina and before) do not support
 * addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
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
        // oxlint-disable-next-line typescript/no-deprecated
        query.addListener(callback)
        return () => {
            // oxlint-disable-next-line typescript/no-deprecated
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

export function useMediaQuery(
    query: string,
    initialValue?: boolean,
    { getInitialValueInEffect }: UseMediaQueryOptions = defaultOptions
): boolean {
    const [matches, setMatches] = useState(
        getInitialValueInEffect ? initialValue : getInitialValue(query)
    )
    useEffect(() => {
        try {
            const mediaQuery = window.matchMedia(query)
            return attachMediaListener(mediaQuery, (event) => {
                setMatches(event.matches)
            })
        } catch (_e) {
            // Safari iframe compatibility issue
        }
    }, [query])

    return matches ?? false
}
