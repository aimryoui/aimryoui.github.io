import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AudioState {
    isAudioEnabled: boolean
    audioMode: "manual" | "auto"
    hasManuallyToggled: boolean
    toggleAudio: () => void
    setAudioMode: (mode: "manual" | "auto") => void
    setIsAudioEnabled: (enabled: boolean) => void
}

const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            isAudioEnabled: false,
            audioMode: "manual",
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

            partialize: (state) => ({ audioMode: state.audioMode })
        }
    )
)

export type { AudioState }
export { useAudioStore }
