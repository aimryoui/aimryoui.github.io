import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    DEFAULT_DIRECTION_PREFERENCE,
    type DirectionPreference,
    directionPreferenceSchema
} from "@/configs/direction.config"

const directionStoreSchema = z.object({
    preference: directionPreferenceSchema
})

interface DirectionStore {
    preference: DirectionPreference
    setPreference: (preference: DirectionPreference) => void
    reset: () => void
}

const useDirectionStore = create<DirectionStore>()(
    persist(
        (set, get) => ({
            preference: DEFAULT_DIRECTION_PREFERENCE,
            setPreference: (preference) => {
                set({ preference })
            },
            reset: () => {
                get().setPreference(DEFAULT_DIRECTION_PREFERENCE)
            }
        }),
        {
            name: "nhn-direction-preference",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = directionStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export type { DirectionPreference }
export { useDirectionStore }
