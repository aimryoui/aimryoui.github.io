import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const motionPreferenceSchema = z.enum(["system", "preferred", "reduced"])
type MotionPreference = z.infer<typeof motionPreferenceSchema>

const motionStoreSchema = z.object({
    preference: motionPreferenceSchema
})

interface MotionStore {
    preference: MotionPreference
    setPreference: (preference: MotionPreference) => void
}

const useMotionStore = create<MotionStore>()(
    persist(
        (set) => ({
            preference: "system",
            setPreference: (preference) => {
                set({ preference })
                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-motion",
                        preference
                    )
                }
            }
        }),
        {
            name: "motion-preference",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = motionStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export type { MotionPreference }
export { useMotionStore }
