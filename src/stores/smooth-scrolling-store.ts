import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const smoothScrollingStoreSchema = z.object({
    isSmoothScrollingEnabled: z.boolean().catch(false)
})

interface SmoothScrollingStore {
    isSmoothScrollingEnabled: boolean
    setIsSmoothScrollingEnabled: (enabled: boolean) => void
    reset: () => void
}

const DEFAULT_SMOOTH_SCROLLING_PREFERENCE = false

const useSmoothScrollingStore = create<SmoothScrollingStore>()(
    persist(
        (set) => ({
            isSmoothScrollingEnabled: DEFAULT_SMOOTH_SCROLLING_PREFERENCE,
            setIsSmoothScrollingEnabled: (enabled) => {
                set({ isSmoothScrollingEnabled: enabled })
            },
            reset: () => {
                set({ isSmoothScrollingEnabled: false })
            }
        }),
        {
            name: "nhn-smooth-scrolling-preference",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed =
                    smoothScrollingStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export { DEFAULT_SMOOTH_SCROLLING_PREFERENCE, useSmoothScrollingStore }
