import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DEFAULT_EFFECTS, type Effect } from "@/configs/effects.config"

interface EffectsStore {
    effects: Effect[]
    setEffects: (effects: Effect[]) => void
    toggleEffect: (effect: Effect) => void
    hasEffect: (effect: Effect) => boolean
}

const useEffectsStore = create<EffectsStore>()(
    persist(
        (set, get) => ({
            effects: DEFAULT_EFFECTS,
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
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export { useEffectsStore }
