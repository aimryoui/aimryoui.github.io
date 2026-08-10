import { useCallback } from "react"

import { useWebHaptics } from "web-haptics/react"

import { type HapticVariantsType } from "@/components/ui/button"
import { useDevice } from "@/hooks/use-device"
import { type PressSoundType, playPressSound } from "@/lib/sounds"
import { useAudioStore } from "@/stores/audio-store"
import { useHapticsStore } from "@/stores/haptics-store"

function usePressFeedback() {
    const { trigger } = useWebHaptics()
    const { isTouchDevice } = useDevice()

    const playFeedback = useCallback(
        (
            soundType: PressSoundType = "button",
            hapticType: HapticVariantsType = "light"
        ) => {
            if (useAudioStore.getState().isAudioEnabled) {
                playPressSound(soundType)
            }

            if (isTouchDevice && useHapticsStore.getState().isHapticEnabled) {
                void trigger(hapticType)
            }
        },
        [trigger, isTouchDevice]
    )

    return playFeedback
}

export { usePressFeedback }
