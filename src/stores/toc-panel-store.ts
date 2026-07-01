"use client"

import { create } from "zustand"

interface TocPanelStore {
    isOpen: boolean
    toggle: () => void
    close: () => void
}

const useTocPanelStore = create<TocPanelStore>()((set) => ({
    isOpen: false,
    toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }))
    },
    close: () => {
        set({ isOpen: false })
    }
}))

export { useTocPanelStore }
