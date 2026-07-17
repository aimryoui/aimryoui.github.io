"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type SidebarPosition = "left" | "right"

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
            storage: createJSONStorage(() => localStorage)
        }
    )
)

type ToolbarPosition = "top" | "bottom"

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
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export type { SidebarPosition, ToolbarPosition }
export { useSidebarPositionStore, useToolbarPositionStore }
