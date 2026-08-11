import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const hapticsStoreSchema = z.object({
    isHapticEnabled: z.boolean().catch(true)
})

interface HapticsStore {
    isHapticEnabled: boolean
    setIsHapticEnabled: (enabled: boolean) => void
}

const useHapticsStore = create<HapticsStore>()(
    persist(
        (set) => ({
            isHapticEnabled: true,
            setIsHapticEnabled: (enabled) => {
                set({ isHapticEnabled: enabled })
            }
        }),
        {
            name: "haptics-preferences",
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

export { useHapticsStore }
