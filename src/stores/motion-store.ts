import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    DEFAULT_MOTION_PREFERENCES,
    type MotionPreference,
    motionPreferenceSchema
} from "@/configs/motion.config"

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
            preference: DEFAULT_MOTION_PREFERENCES,
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
