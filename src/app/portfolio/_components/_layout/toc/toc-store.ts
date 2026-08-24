import { create } from "zustand"

interface TocRevealStore {
    hasRevealedOnLoad: boolean
    markTocRevealed: () => void
}

const useTocRevealStore = create<TocRevealStore>((set) => ({
    hasRevealedOnLoad: false,
    markTocRevealed: () => {
        set({ hasRevealedOnLoad: true })
    }
}))

export { useTocRevealStore }
