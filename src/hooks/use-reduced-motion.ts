import {
    type UseMediaQueryOptions,
    useMediaQuery
} from "@/hooks/use-media-query"

function useReducedMotion(
    initialValue?: boolean,
    options?: UseMediaQueryOptions
) {
    return useMediaQuery(
        "(prefers-reduced-motion: reduce)",
        initialValue,
        options
    )
}

export { useReducedMotion }
