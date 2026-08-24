import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const hapticsStoreSchema = z.object({
    isHapticEnabled: z.boolean().catch(true)
})

interface HapticsStore {
    isHapticEnabled: boolean
    setIsHapticEnabled: (enabled: boolean) => void
    reset: () => void
}

const DEFAULT_HAPTICS_PREFERENCE = true

const useHapticsStore = create<HapticsStore>()(
    persist(
        (set) => ({
            isHapticEnabled: DEFAULT_HAPTICS_PREFERENCE,
            setIsHapticEnabled: (enabled) => {
                set({ isHapticEnabled: enabled })
            },
            reset: () => {
                set({ isHapticEnabled: true })
            }
        }),
        {
            name: "nhn-haptics-preferences",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = hapticsStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export { DEFAULT_HAPTICS_PREFERENCE, useHapticsStore }
