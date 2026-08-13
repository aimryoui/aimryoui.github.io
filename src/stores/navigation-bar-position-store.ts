import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES,
    type SidebarPosition,
    sidebarPositionSchema,
    type ToolbarPosition,
    toolbarPositionSchema
} from "@/configs/navigation.config"

const sidebarStoreSchema = z.object({
    position: sidebarPositionSchema
})

interface SidebarPositionStore {
    position: SidebarPosition
    setPosition: (position: SidebarPosition) => void
    reset: () => void
}

const useSidebarPositionStore = create<SidebarPositionStore>()(
    persist(
        (set, get) => ({
            position: DEFAULT_SIDEBAR_PREFERENCES,
            setPosition: (position) => {
                set({ position })

                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-sidebar-position",
                        position
                    )
                }
            },
            reset: () => {
                get().setPosition(DEFAULT_SIDEBAR_PREFERENCES)
            }
        }),
        {
            name: "nhn-sidebar-position",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = sidebarStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

const toolbarStoreSchema = z.object({
    position: toolbarPositionSchema
})

interface ToolbarPositionStore {
    position: ToolbarPosition
    setPosition: (position: ToolbarPosition) => void
    reset: () => void
}

const useToolbarPositionStore = create<ToolbarPositionStore>()(
    persist(
        (set, get) => ({
            position: DEFAULT_TOOLBAR_PREFERENCES,
            setPosition: (position) => {
                set({ position })

                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-toolbar-position",
                        position
                    )
                }
            },
            reset: () => {
                get().setPosition(DEFAULT_TOOLBAR_PREFERENCES)
            }
        }),
        {
            name: "nhn-toolbar-position",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = toolbarStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export type { SidebarPosition, ToolbarPosition }
export { useSidebarPositionStore, useToolbarPositionStore }
