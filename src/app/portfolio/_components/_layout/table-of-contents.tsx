"use client"

import { useEffect, useRef, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { ArrowLeft } from "@/components/icons/icons"
import { SectionLine } from "@/components/layout/line"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
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

interface NormalizedTocItem extends TocItemProps {
    _normalizedLabel: string
}

function getFilteredItems(normalizedItems: NormalizedTocItem[], query: string) {
    if (!query.trim()) return normalizedItems

    const normalizedQuery = removeAccents(query.toLowerCase().trim())
    const result: TocItemProps[] = []
    let currentCategory: NormalizedTocItem | null = null
    let currentChildren: NormalizedTocItem[] = []

    const flushGroup = () => {
        if (currentCategory) {
            const isCategoryMatch =
                currentCategory._normalizedLabel.includes(normalizedQuery)
            const matchingChildren = currentChildren.filter((child) =>
                child._normalizedLabel.includes(normalizedQuery)
            )

            if (isCategoryMatch || matchingChildren.length > 0) {
                result.push(currentCategory)
                result.push(...matchingChildren)
            }
        }
        currentCategory = null
        currentChildren = []
    }

    for (const item of normalizedItems) {
        if (item.hidden) continue

        if (item.depth === 1 || item.depth === 2) {
            flushGroup()
            currentCategory = item
        } else if (currentCategory) {
            currentChildren.push(item)
        } else {
            flushGroup()
            if (item._normalizedLabel.includes(normalizedQuery)) {
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
                        prefetch={false}
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
    const inputRef = useRef<HTMLInputElement>(null)

    // 'waiting' = mask on, no animation (TOC hidden)
    // 'animating' = mask + animate-nav-reveal (revealing)
    // 'done' = all mask/animation classes removed
    const [navRevealPhase, setNavRevealPhase] = useState<
        "waiting" | "animating" | "done"
    >(mobile ? "done" : "waiting")

    const handleActiveReady = () => {
        setNavRevealPhase("animating")
    }

    useEffect(() => {
        if (navRevealPhase !== "animating") return

        const timer = setTimeout(() => {
            setNavRevealPhase("done")
        }, 1000) // matches nav-reveal animation duration

        return () => {
            clearTimeout(timer)
        }
    }, [navRevealPhase])

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

    const handleClearSearch = () => {
        setQuery("")
        inputRef.current?.focus()
    }

    const normalizedItems = items.map((item) => ({
        ...item,
        _normalizedLabel: removeAccents(item.label.toLowerCase())
    }))

    const filteredItems = getFilteredItems(normalizedItems, debouncedQuery)

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
                <Tooltip>
                    <BackToPortfolio mode={mode} />
                    <TocSearch
                        ref={inputRef}
                        value={query}
                        onChange={setQuery}
                        onClear={handleClearSearch}
                    />
                </Tooltip>
            </div>
            <SectionLine
                fit
                // style={{
                //     viewTransitionName: "toc-divider-search"
                // }}
            />
            <nav
                aria-label="Table of contents"
                className={cn(
                    "flex flex-1 flex-col overflow-auto",
                    navRevealPhase === "animating" && "animate-nav-reveal"
                )}
                {...(navRevealPhase !== "done" && {
                    style: {
                        maskImage:
                            "linear-gradient(black 33.333%, black 35%, transparent 65%, transparent 100%)",
                        maskPosition: "0 100%",
                        maskSize: "100% 300%",
                        willChange: "mask-position"
                    }
                })}
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
                        onActiveReady={handleActiveReady}
                    />
                )}
            </nav>
        </>
    )
}
