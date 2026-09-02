"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { sendGAEvent } from "@next/third-parties/google"

import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"
import { TocStoreProvider } from "@/portfolio/_components/_layout/toc/providers/toc-store-provider"
import { useTocRevealStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { type TocProps } from "@/portfolio/_components/_layout/toc/toc"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import {
    type TocConfig,
    type TocItemProps
} from "@/portfolio/_components/_layout/toc/types/toc"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"

const Toc = dynamic(() => import("./toc"), {
    ssr: false,
    loading: () => <div className="flex-1 lg:hidden" />
})

const EMPTY_ITEMS: TocItemProps[] = []

function TableOfContents({
    className,
    items = EMPTY_ITEMS,
    showSearch = true,
    compact = false,
    labelElement,
    lineSidebarEffect,
    enableStartEndAutoHighlight = true
}: TocConfig
    & Omit<TocProps, "shouldAnimate" | "handleClearSearch"> & {
        showSearch?: boolean
    }) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [shouldAnimate] = useState(
        () => !useTocRevealStore.getState().hasRevealedOnLoad
    )

    const {
        query,
        setQuery,
        debouncedQuery,
        filteredItems,
        handleClearSearch
    } = useTocSearch(inputRef, items)

    useEffect(() => {
        if (debouncedQuery && filteredItems.length === 0) {
            const eventName = "search_toc_no_result"
            const eventParams = { search_query: debouncedQuery }
            sendGAEvent("event", eventName, eventParams)
        }
    }, [debouncedQuery, filteredItems.length])

    if (items.length === 0) return null

    return (
        <TocStoreProvider
            compact={compact}
            labelElement={labelElement}
            lineSidebarEffect={lineSidebarEffect}
            enableStartEndAutoHighlight={enableStartEndAutoHighlight}
            items={items}
            filteredItems={filteredItems}
            query={debouncedQuery}
        >
            {showSearch && (
                <TocHeader
                    ref={inputRef}
                    value={query}
                    onChange={setQuery}
                    onClear={handleClearSearch}
                    containerClassName="lg:hidden"
                />
            )}
            <SectionLine fit containerClassName="lg:hidden" />
            <Toc
                handleClearSearch={handleClearSearch}
                shouldAnimate={shouldAnimate}
                className={cn(className)}
            />
        </TocStoreProvider>
    )
}

export { TableOfContents }
