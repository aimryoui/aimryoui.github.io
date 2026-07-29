"use client"

import { useEffect, useRef, useState } from "react"

import { SectionLine } from "@/components/layout/line"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { cn } from "@/lib/utils"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { TocList } from "@/portfolio/_components/_layout/toc/toc-list"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocProps {
    mode: PortfolioMode
    items: TocItemProps[]
}

function TableOfContents({ mode, items }: TocProps) {
    const isMounted = useIsMounted()
    const rafRef = useRef<number | null>(null)

    const inputRef = useRef<HTMLInputElement>(null)

    const hasRevealed = useRef(false)

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
    >("waiting")

    const handleActiveReady = () => {
        if (hasRevealed.current) return
        hasRevealed.current = true

        rafRef.current = requestAnimationFrame(() => {
            setNavRevealPhase("animating")
        })
    }

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
        if (e.animationName === "toc-reveal") {
            setNavRevealPhase("done")
        }
    }

    useEffect(
        () => () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        },
        []
    )

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
                        navRevealPhase === "animating" && "animate-toc-reveal",
                        {
                            lg: "hidden"
                        }
                    )}
                    onAnimationEnd={handleAnimationEnd}
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
                        <TocSearchNoResult onClear={handleClearSearch} />
                    ) : (
                        <TocList
                            mode={mode}
                            items={items}
                            debouncedQuery={debouncedQuery}
                            filteredItems={filteredItems}
                            onActiveReady={handleActiveReady}
                        />
                    )}
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
