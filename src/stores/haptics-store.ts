import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export { useHapticsStore }
