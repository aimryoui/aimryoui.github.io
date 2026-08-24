"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { sendGAEvent } from "@next/third-parties/google"

import { SectionLine } from "@/components/layout/line"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocRevealStore } from "@/portfolio/_components/_layout/toc/toc-store"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"

const Toc = dynamic(() => import("./toc"), {
    ssr: false,
    loading: () => <div className="flex-1 lg:hidden" />
})

interface TocProps {
    items: TocItemProps[]
}

function TableOfContents({ items }: TocProps) {
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
        <>
            <TocHeader
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onClear={handleClearSearch}
                containerClassName="lg:hidden"
            />
            <SectionLine fit containerClassName="lg:hidden" />
            <Toc
                items={items}
                debouncedQuery={debouncedQuery}
                filteredItems={filteredItems}
                handleClearSearch={handleClearSearch}
                shouldAnimate={shouldAnimate}
            />
        </>
    )
}

export { TableOfContents }
