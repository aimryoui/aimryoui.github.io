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
    const motionPreference = useMotionStore((state) => state.preference)

    if (motionPreference === "reduced") return true
    if (motionPreference === "preferred") return false
    return systemReduced
}

export { useReducedMotion }
