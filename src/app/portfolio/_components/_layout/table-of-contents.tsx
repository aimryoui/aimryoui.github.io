"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { SectionLine } from "@/components/layout/line"
import { Highlight, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { type TocItemProps } from "@/portfolio/_components/_layout/_toc/toc-item-row"
import { TocList } from "@/portfolio/_components/_layout/_toc/toc-list"
import { TocSearch } from "@/portfolio/_components/_layout/_toc/toc-search"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocProps {
    items: TocItemProps[]
}

function removeAccents(str: string): string {
    return str
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036F]/g, "")
        .replaceAll(/[đĐ]/g, "d")
}

function getFilteredItems(items: TocItemProps[], query: string) {
    if (!query.trim()) return items

    const normalizedQuery = removeAccents(query.toLowerCase().trim())
    const result: TocItemProps[] = []
    let currentCategory: TocItemProps | null = null
    let currentChildren: TocItemProps[] = []

    const flushGroup = () => {
        if (currentCategory) {
            const isCategoryMatch = removeAccents(
                currentCategory.label.toLowerCase()
            ).includes(normalizedQuery)
            const matchingChildren = currentChildren.filter((child) =>
                removeAccents(child.label.toLowerCase()).includes(
                    normalizedQuery
                )
            )

            if (isCategoryMatch || matchingChildren.length > 0) {
                result.push(currentCategory)
                result.push(...matchingChildren)
            }
        }
        currentCategory = null
        currentChildren = []
    }

    for (const item of items) {
        if (item.hidden) continue

        if (item.depth === 1 || item.depth === 2) {
            flushGroup()
            currentCategory = item
        } else if (currentCategory) {
            currentChildren.push(item)
        } else {
            flushGroup()
            if (
                removeAccents(item.label.toLowerCase()).includes(
                    normalizedQuery
                )
            ) {
                result.push(item)
            }
        }
    }
    flushGroup()

    return result
}

export function TableOfContents({
    mode,
    items
}: TocProps & { mode: PortfolioMode }) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [hasPageMounted, setHasPageMounted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const SearchDelay = 500

    useEffect(() => {
        const delay = query.length === 0 ? 0 : SearchDelay
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, delay)
        return () => {
            clearTimeout(timer)
        }
    }, [query])

    const handleClearSearch = useCallback(() => {
        setQuery("")
        setDebouncedQuery("")
        inputRef.current?.focus()
    }, [])

    const filteredItems = getFilteredItems(items, debouncedQuery)

    if (items.length === 0) return null

    return (
        <>
            <header className={cn("px-6 py-5.5")}>
                <TocSearch
                    ref={inputRef}
                    value={query}
                    onChange={setQuery}
                    onClear={handleClearSearch}
                />
            </header>
            <SectionLine fit />
            <nav className="flex flex-1 flex-col overflow-auto">
                {filteredItems.length === 0 ? (
                    <Text className={cn("px-6 py-4 text-sm")}>
                        No results found.{" "}
                        <Highlight
                            onClick={handleClearSearch}
                            className={cn(
                                "cursor-pointer decoration-solid hover:underline"
                            )}
                        >
                            Clear search
                        </Highlight>
                    </Text>
                ) : (
                    <TocList
                        mode={mode}
                        items={items}
                        filteredItems={filteredItems}
                        hasPageMounted={hasPageMounted}
                        setHasPageMounted={setHasPageMounted}
                    />
                )}
            </nav>
        </>
    )
}
