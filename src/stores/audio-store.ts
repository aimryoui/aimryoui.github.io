import { z } from "zod"
import { create } from "zustand"
import { persist } from "zustand/middleware"

const audioModeSchema = z.enum(["manual", "auto"])

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
