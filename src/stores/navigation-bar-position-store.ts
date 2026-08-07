import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const sidebarPositionSchema = z.enum(["left", "right"])
type SidebarPosition = z.infer<typeof sidebarPositionSchema>

const sidebarStoreSchema = z.object({
    position: sidebarPositionSchema
})

interface SidebarPositionStore {
    position: SidebarPosition
    setPosition: (position: SidebarPosition) => void
}

const useSidebarPositionStore = create<SidebarPositionStore>()(
    persist(
        (set) => ({
            position: "left",
            setPosition: (position) => {
                set({ position })

                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-sidebar-position",
                        position
                    )
                }
            }
        }),
        {
            name: "sidebar-position",
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

const toolbarPositionSchema = z.enum(["top", "bottom"])
type ToolbarPosition = z.infer<typeof toolbarPositionSchema>

const toolbarStoreSchema = z.object({
    position: toolbarPositionSchema
})

interface ToolbarPositionStore {
    position: ToolbarPosition
    setPosition: (position: ToolbarPosition) => void
}

const useToolbarPositionStore = create<ToolbarPositionStore>()(
    persist(
        (set) => ({
            position: "bottom",
            setPosition: (position) => {
                set({ position })

                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-toolbar-position",
                        position
                    )
                }
            }
        }),
        {
            name: "toolbar-position",
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
