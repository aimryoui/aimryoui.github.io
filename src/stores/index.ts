import { useAudioStore } from "@/stores/audio-store"
import { useDirectionStore } from "@/stores/direction-store"
import { useEffectsStore } from "@/stores/effects-store"
import { useHapticsStore } from "@/stores/haptics-store"
import { useMediaStore } from "@/stores/media-store"
import { useMotionStore } from "@/stores/motion-store"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"
import { useSmoothScrollingStore } from "@/stores/smooth-scrolling-store"

const PREFERENCE_STORES = [
    useAudioStore,
    useDirectionStore,
    useEffectsStore,
    useHapticsStore,
    useMediaStore,
    useMotionStore,
    useSidebarPositionStore,
    useToolbarPositionStore,
    useSmoothScrollingStore
]

export { PREFERENCE_STORES }
