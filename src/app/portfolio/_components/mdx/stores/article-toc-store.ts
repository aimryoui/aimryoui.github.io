import { create } from "zustand"

const useArticleTocStore = create<{
    isTocOpen: boolean
    setIsTocOpen: (open: boolean) => void
}>((set) => ({
    isTocOpen: false,
    setIsTocOpen: (open) => {
        set({ isTocOpen: open })
    }
}))

export { useArticleTocStore }
