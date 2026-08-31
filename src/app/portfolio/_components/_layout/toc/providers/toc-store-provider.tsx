"use client"

import { useEffect, useState } from "react"

import {
    createTocStore,
    TocStoreContext,
    type TocStoreProps
} from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"

const EMPTY_ITEMS: TocItemProps[] = []

type TocStoreProviderProps = TocStoreProps & {
    children: React.ReactNode
}

function TocStoreProvider({
    children,
    enableStartEndAutoHighlight = true,
    compact = false,
    labelElement,
    items = EMPTY_ITEMS,
    filteredItems = EMPTY_ITEMS,
    query = ""
}: TocStoreProviderProps) {
    const [store] = useState(() =>
        createTocStore({
            enableStartEndAutoHighlight,
            compact,
            items,
            filteredItems,
            query,
            labelElement
        })
    )

    useEffect(() => {
        store.setState({
            enableStartEndAutoHighlight,
            compact,
            items,
            filteredItems,
            query,
            labelElement
        })
    }, [
        store,
        enableStartEndAutoHighlight,
        compact,
        items,
        filteredItems,
        query,
        labelElement
    ])

    return (
        <TocStoreContext.Provider value={store}>
            {children}
        </TocStoreContext.Provider>
    )
}

export { TocStoreProvider }
