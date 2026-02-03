import { useEffect, useState } from "react"

export interface UseMediaQueryOptions {
    getInitialValueInEffect: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
function attachMediaListener(
    query: MediaQueryList,
    callback: MediaQueryCallback
) {
    try {
        query.addEventListener("change", callback)
        return () => {
            query.removeEventListener("change", callback)
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (e) {
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

export function useMediaQuery(
    query: string,
    initialValue?: boolean,
    { getInitialValueInEffect }: UseMediaQueryOptions = {
        getInitialValueInEffect: true
    }
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
            // eslint-disable-next-line unused-imports/no-unused-vars
        } catch (e) {
            // Safari iframe compatibility issue
            return undefined
        }
    }, [query])

    return matches ?? false
}
