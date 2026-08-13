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
    reset: () => void
}

const useMotionStore = create<MotionStore>()(
    persist(
        (set, get) => ({
            preference: DEFAULT_MOTION_PREFERENCES,
            setPreference: (preference) => {
                set({ preference })
                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-motion",
                        preference
                    )
                }
            },
            reset: () => {
                get().setPreference(DEFAULT_MOTION_PREFERENCES)
            }
        }),
        {
            name: "nhn-motion-preference",
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
