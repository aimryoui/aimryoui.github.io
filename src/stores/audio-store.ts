import { z } from "zod"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { audioModeSchema, DEFAULT_AUDIO_PREFERENCES } from "@/configs/audio.config"

const audioStoreSchema = z.object({
    audioMode: audioModeSchema
})

interface AudioState {
    isAudioEnabled: boolean
    audioMode: z.infer<typeof audioModeSchema>
    hasManuallyToggled: boolean
    toggleAudio: () => void
    setAudioMode: (mode: "manual" | "auto") => void
    setIsAudioEnabled: (enabled: boolean) => void
}

const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            isAudioEnabled: DEFAULT_AUDIO_PREFERENCES.isAudioEnabled,
            audioMode: DEFAULT_AUDIO_PREFERENCES.audioMode,
            hasManuallyToggled: false,
            toggleAudio: () => {
                set((state) => ({
                    isAudioEnabled: !state.isAudioEnabled,
                    hasManuallyToggled: true
                }))
            },
            setAudioMode: (mode) => {
                set({ audioMode: mode })
            },
            setIsAudioEnabled: (enabled) => {
                set({ isAudioEnabled: enabled })
            }
        }),
        {
            name: "audio-mode",

            partialize: (state) => ({ audioMode: state.audioMode }),
            merge: (persistedState, currentState) => {
                const parsed = audioStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export type { AudioState }
export { useAudioStore }
