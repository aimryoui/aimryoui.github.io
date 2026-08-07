import {
    type UseMediaQueryOptions,
    useMediaQuery
} from "@/hooks/use-media-query"
import { useMotionStore } from "@/stores/motion-store"

function useReducedMotion(
    initialValue?: boolean,
    options?: UseMediaQueryOptions
) {
    const systemReduced = useMediaQuery(
        "(prefers-reduced-motion: reduce)",
        initialValue,
        options
    )
    const preference = useMotionStore((state) => state.preference)

    if (preference === "reduced") return true
    if (preference === "preferred") return false
    return systemReduced
}

export { useReducedMotion }
