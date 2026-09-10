import { z } from "zod"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
    audioModeSchema,
    DEFAULT_AUDIO_PREFERENCES
} from "@/configs/audio.config"

const audioStoreSchema = z.object({
    audioMode: audioModeSchema
})

interface AudioState {
    isAudioEnabled: boolean
    audioMode: z.infer<typeof audioModeSchema>
    hasManuallyToggled: boolean
    activeMediaAudioCount: number
    isMediaAudioPlaying: boolean
    toggleAudio: () => void
    setAudioMode: (mode: "manual" | "auto") => void
    setIsAudioEnabled: (enabled: boolean) => void
    setMediaAudioActive: (active: boolean) => void
    reset: () => void
}

const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            isAudioEnabled: DEFAULT_AUDIO_PREFERENCES.isAudioEnabled,
            audioMode: DEFAULT_AUDIO_PREFERENCES.audioMode,
            hasManuallyToggled: false,
            activeMediaAudioCount: 0,
            isMediaAudioPlaying: false,
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
            },
            setMediaAudioActive: (active) => {
                set((state) => {
                    const nextCount = Math.max(
                        0,
                        state.activeMediaAudioCount + (active ? 1 : -1)
                    )
                    return {
                        activeMediaAudioCount: nextCount,
                        isMediaAudioPlaying: nextCount > 0
                    }
                })
            },
            reset: () => {
                set({
                    isAudioEnabled: DEFAULT_AUDIO_PREFERENCES.isAudioEnabled,
                    audioMode: DEFAULT_AUDIO_PREFERENCES.audioMode,
                    hasManuallyToggled: false,
                    activeMediaAudioCount: 0,
                    isMediaAudioPlaying: false
                })
            }
        }),
        {
            name: "nhn-audio-mode",

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
