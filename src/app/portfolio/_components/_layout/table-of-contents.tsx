"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { ArrowLeft } from "@/components/icons/icons"
import { SectionLine } from "@/components/layout/line"
import { buttonVariants } from "@/components/ui/button"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { MobileTocList } from "@/portfolio/_components/_layout/_toc/mobile/mobile-toc-list"
import { type TocItemProps } from "@/portfolio/_components/_layout/_toc/toc-item-row"
import { TocList } from "@/portfolio/_components/_layout/_toc/toc-list"
import { TocSearch } from "@/portfolio/_components/_layout/_toc/toc-search"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocProps {
    mode: PortfolioMode
    items: TocItemProps[]
    mobile?: boolean
}

function removeAccents(str: string): string {
    return str
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036F]/gu, "")
        .replaceAll(/[đĐ]/gu, "d")
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

function BackToPortfolio({ mode }: { mode: PortfolioMode }) {
    const pathname = usePathname()

    if (mode === "pages" && pathname !== "/portfolio") {
        return (
            <TooltipTrigger
                delay={500}
                payload={{
                    content: (
                        <span className="flex items-center gap-1">
                            Back to Portfolio
                        </span>
                    ),
                    side: "bottom"
                }}
                render={
                    <NextLink
                        href="/portfolio#projects"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "icon"
                            }),
                            {
                                lg: "size-[36px]"
                            }
                        )}
                    >
                        <ArrowLeft className="size-4 lg:size-5" />
                        <span className="sr-only">Back to Portfolio</span>
                    </NextLink>
                }
            />
        )
    }
}

const SEARCH_DELAY = 500

export function TableOfContents({ mode, items, mobile = false }: TocProps) {
    const [query, setQuery] = useState("")
    // const [_, startTransition] = useTransition()
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [hasPageMounted, setHasPageMounted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // if (!isPending) {
        const delay = query.length === 0 ? 0 : SEARCH_DELAY
        const timer = setTimeout(() => {
            // startTransition(() => {
            setDebouncedQuery(query)
            // })
        }, delay)
        return () => {
            clearTimeout(timer)
        }
        // }
    }, [query])

    const handleClearSearch = useCallback(() => {
        setQuery("")
        inputRef.current?.focus()
    }, [])

    const filteredItems = getFilteredItems(items, debouncedQuery)

    if (items.length === 0) return null

    return (
        <>
            <div
                className={cn("flex gap-2 bg-background px-6 py-5.5", {
                    lg: "gap-4"
                })}
                // style={{
                //     viewTransitionName: "header"
                // }}
            >
                <BackToPortfolio mode={mode} />
                <TocSearch
                    ref={inputRef}
                    value={query}
                    onChange={setQuery}
                    onClear={handleClearSearch}
                />
            </div>
            <SectionLine
                fit
                // style={{
                //     viewTransitionName: "toc-divider-search"
                // }}
            />
            <nav
                role="navigation"
                aria-label="Table of contents"
                className={cn("flex flex-1 flex-col overflow-auto")}
            >
                {filteredItems.length === 0 ? (
                    <Text className={cn("px-6 py-4")}>
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
                ) : mobile ? (
                    <MobileTocList
                        mode={mode}
                        items={items}
                        filteredItems={filteredItems}
                    />
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
