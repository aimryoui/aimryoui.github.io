"use client"

import { useEffect, useRef, useState } from "react"

import { sendGAEvent } from "@next/third-parties/google"

import { SectionLine } from "@/components/layout/line"
import { Tooltip } from "@/components/ui/tooltip"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { cn } from "@/lib/utils"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { TocList } from "@/portfolio/_components/_layout/toc/toc-list"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"

interface TocProps {
    items: TocItemProps[]
}

let hasRevealedOnLoad = false

export function markTocRevealed() {
    hasRevealedOnLoad = true
}

function TableOfContents({ items }: TocProps) {
    const isMounted = useIsMounted()
    const rafRef = useRef<number | null>(null)

    const inputRef = useRef<HTMLInputElement>(null)

    const hasRevealed = useRef(hasRevealedOnLoad)

    const {
        query,
        setQuery,
        debouncedQuery,
        filteredItems,
        handleClearSearch
    } = useTocSearch(inputRef, items)

    // const [_, startTransition] = useTransition()

    // 'waiting' = mask on, no animation (TOC hidden)
    // 'animating' = mask + animate-toc-reveal (revealing)
    // 'done' = all mask/animation classes removed
    const [navRevealPhase, setNavRevealPhase] = useState<
        "waiting" | "animating" | "done"
    >(hasRevealedOnLoad ? "done" : "waiting")

    const handleActiveReady = () => {
        if (hasRevealed.current) return
        hasRevealed.current = true
        hasRevealedOnLoad = true

        rafRef.current = requestAnimationFrame(() => {
            setNavRevealPhase("animating")
        })
    }

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
        if (
            e.animationName === "toc-reveal"
            || e.animationName === "toc-fade"
        ) {
            setNavRevealPhase("done")
        }
    }

    useEffect(
        () => () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        },
        []
    )

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
            <SectionLine
                fit
                containerClassName="lg:hidden"
                // style={{
                //     viewTransitionName: "toc-divider-search"
                // }}
            />
            {isMounted ? (
                <nav
                    aria-label="Table of contents"
                    className={cn(
                        "flex flex-1 flex-col overflow-auto",
                        navRevealPhase === "animating" && [
                            "motion-preferred:animate-toc-reveal",
                            "motion-reduced:animate-toc-fade"
                        ],
                        navRevealPhase !== "done" && [
                            "motion-preferred:[mask-image:linear-gradient(black_33.333%,black_35%,transparent_65%,transparent_100%)]",
                            "motion-preferred:[mask-position:0_100%]",
                            "motion-preferred:[mask-size:100%_300%]",
                            "motion-preferred:will-change-[mask-position]",
                            "motion-reduced:opacity-0"
                        ],
                        {
                            lg: "hidden"
                        }
                    )}
                    onAnimationEnd={handleAnimationEnd}
                >
                    <Tooltip>
                        {filteredItems.length === 0 ? (
                            <TocSearchNoResult onClear={handleClearSearch} />
                        ) : (
                            <TocList
                                items={items}
                                debouncedQuery={debouncedQuery}
                                filteredItems={filteredItems}
                                onActiveReady={handleActiveReady}
                            />
                        )}
                    </Tooltip>
                </nav>
            ) : (
                <div
                    className={cn("flex-1", {
                        lg: "hidden"
                    })}
                />
            )}
        </>
    )
}

export { TableOfContents }
