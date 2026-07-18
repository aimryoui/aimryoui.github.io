"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type PortfolioMode = "pages" | "spread"

interface PortfolioModeStore {
    mode: PortfolioMode
    setMode: (mode: PortfolioMode) => void
}

const usePortfolioModeStore = create<PortfolioModeStore>()(
    persist(
        (set) => ({
            mode: "pages",
            setMode: (mode) => {
                set({ mode })

                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-portfolio-mode",
                        mode
                    )
                }
            }
        }),
        {
            name: "portfolio-mode",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export type { PortfolioMode }
export { usePortfolioModeStore }
