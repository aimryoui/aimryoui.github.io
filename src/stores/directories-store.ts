import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const directoriesStoreSchema = z.object({
    isDirectoriesMenuEnabled: z.boolean().catch(false)
})

interface DirectoriesStore {
    isDirectoriesMenuEnabled: boolean
    setIsDirectoriesMenuEnabled: (enabled: boolean) => void
    reset: () => void
}

const DEFAULT_DIRECTORIES_MENU_PREFERENCE = false

const useDirectoriesStore = create<DirectoriesStore>()(
    persist(
        (set) => ({
            isDirectoriesMenuEnabled: DEFAULT_DIRECTORIES_MENU_PREFERENCE,
            setIsDirectoriesMenuEnabled: (enabled) => {
                set({ isDirectoriesMenuEnabled: enabled })
            },
            reset: () => {
                set({ isDirectoriesMenuEnabled: DEFAULT_DIRECTORIES_MENU_PREFERENCE })
            }
        }),
        {
            name: "nhn-directories-menu",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = directoriesStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export { DEFAULT_DIRECTORIES_MENU_PREFERENCE, useDirectoriesStore }
