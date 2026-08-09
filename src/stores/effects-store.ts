import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    AVAILABLE_EFFECTS,
    DEFAULT_EFFECTS_PREFERENCES,
    type Effect
} from "@/configs/effects.config"

const effectSchema = z.enum(AVAILABLE_EFFECTS)
const effectsStoreSchema = z.object({
    effects: z.array(effectSchema)
})

interface EffectsStore {
    effects: Effect[]
    setEffects: (effects: Effect[]) => void
    toggleEffect: (effect: Effect) => void
    hasEffect: (effect: Effect) => boolean
}

const useEffectsStore = create<EffectsStore>()(
    persist(
        (set, get) => ({
            effects: DEFAULT_EFFECTS_PREFERENCES,
            setEffects: (effects) => {
                set({ effects })
                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-effects",
                        effects.length > 0 ? effects.join(" ") : "null"
                    )
                }
            },
            toggleEffect: (effect) => {
                const current = get().effects
                const next = current.includes(effect)
                    ? current.filter((e) => e !== effect)
                    : [...current, effect]
                get().setEffects(next)
            },
            hasEffect: (effect) => get().effects.includes(effect)
        }),
        {
            name: "effects-preference",
            storage: createJSONStorage(() => localStorage),
            version: 2,
            migrate: (persistedState: unknown, version: number) => {
                const state = persistedState as { effects?: string[] } | null
                if (version < 2) {
                    if (
                        state &&
                        Array.isArray(state.effects) &&
                        !state.effects.includes("line-sidebar")
                    ) {
                        state.effects.push("line-sidebar")
                    }
                }
                return state
            },
            merge: (persistedState, currentState) => {
                const parsed = effectsStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export { useEffectsStore }
