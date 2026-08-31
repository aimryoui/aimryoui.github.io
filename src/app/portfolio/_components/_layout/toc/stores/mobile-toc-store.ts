import { create } from "zustand"

const useMobileTocStore = create<{
    isTocOpen: boolean
    setIsTocOpen: (open: boolean) => void
}>((set) => ({
    isTocOpen: false,
    setIsTocOpen: (open) => {
        set({ isTocOpen: open })
    }
}))

export { useMobileTocStore }
