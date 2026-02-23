"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { domAnimation, LazyMotion } from "motion/react"

import { SectionLine } from "@/components/layout/line"
import { Highlight, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { TocList } from "@/portfolio/_components/_layout/_toc/toc-list"
import { TocSearch } from "@/portfolio/_components/_layout/_toc/toc-search"

interface TocItem {
    id: string
    label: string
    depth: 1 | 2 | 3
}

interface TableOfContentsProps {
    items: TocItem[]
}

function removeAccents(str: string): string {
    return str
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036F]/g, "")
        .replaceAll(/[đĐ]/g, "d")
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [hasPageMounted, setHasPageMounted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const SEARCH_DELAY = 500

    useEffect(() => {
        const delay = query.length === 0 ? 0 : SEARCH_DELAY
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

    const filteredItems = useMemo(() => {
        if (!debouncedQuery.trim()) return items

        const normalizedQuery = removeAccents(
            debouncedQuery.toLowerCase().trim()
        )

        const result: TocItem[] = []
        let currentCategory: TocItem | null = null
        let currentChildren: TocItem[] = []

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
    }, [debouncedQuery, items])

    if (items.length === 0) return null

    return (
        <LazyMotion features={domAnimation} strict>
            <nav className="fixed top-0 flex h-[calc(100%-(var(--spacing)*20))] w-inherit flex-col bg-background">
                <TocSearch
                    ref={inputRef}
                    value={query}
                    onChange={setQuery}
                    onClear={handleClearSearch}
                />

                <SectionLine fit containerClassName={cn("mt-4")} />

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
                        items={items}
                        filteredItems={filteredItems}
                        hasPageMounted={hasPageMounted}
                        setHasPageMounted={setHasPageMounted}
                    />
                )}
            </nav>
        </LazyMotion>
    )
}
