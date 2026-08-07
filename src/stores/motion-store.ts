import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type MotionPreference = "system" | "preferred" | "reduced"

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
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export type { MotionPreference }
export { useMotionStore }
