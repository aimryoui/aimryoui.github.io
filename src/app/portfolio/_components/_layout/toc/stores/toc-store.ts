import { createContext, useContext } from "react"

import { create, createStore, type StoreApi, useStore } from "zustand"

import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"

interface TocStoreProps {
    enableStartEndAutoHighlight?: boolean
    compact?: boolean
    labelElement?: "span" | "bdi"
    items?: TocItemProps[]
    filteredItems?: TocItemProps[]
    query?: string
}

interface TocStoreState extends Omit<Required<TocStoreProps>, "labelElement"> {
    activeId: string | null
    setActiveId: (id: string | null) => void
    labelElement?: "span" | "bdi"
}

type TocStoreApi = StoreApi<TocStoreState>

const TocStoreContext = createContext<TocStoreApi | null>(null)

function createTocStore(
    props: Required<Omit<TocStoreProps, "labelElement">> & {
        labelElement?: "span" | "bdi"
    }
): TocStoreApi {
    return createStore<TocStoreState>((set) => ({
        activeId: null,
        setActiveId: (id) => {
            set({ activeId: id })
        },
        ...props
    }))
}

function useTocStore<T>(selector: (state: TocStoreState) => T): T {
    const store = useContext(TocStoreContext)
    if (!store) {
        throw new Error("useTocStore must be used within a TocStoreProvider")
    }
    return useStore(store, selector)
}

function useTocStoreApi(): TocStoreApi {
    const store = useContext(TocStoreContext)
    if (!store) {
        throw new Error("useTocStoreApi must be used within a TocStoreProvider")
    }
    return store
}

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

export type { TocRevealStore, TocStoreApi, TocStoreProps, TocStoreState }
export {
    createTocStore,
    TocStoreContext,
    useTocRevealStore,
    useTocStore,
    useTocStoreApi
}
