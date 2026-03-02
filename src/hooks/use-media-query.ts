import { useEffect, useState } from "react"

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
 *
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
