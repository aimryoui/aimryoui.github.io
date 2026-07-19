"use client"

import { useEffect, useRef, useState } from "react"

import { SectionLine } from "@/components/layout/line"
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
    const inputRef = useRef<HTMLInputElement>(null)

    const { query, setQuery, filteredItems, handleClearSearch } = useTocSearch(
        inputRef,
        items
    )

    // const [_, startTransition] = useTransition()

    // 'waiting' = mask on, no animation (TOC hidden)
    // 'animating' = mask + animate-nav-reveal (revealing)
    // 'done' = all mask/animation classes removed
    const [navRevealPhase, setNavRevealPhase] = useState<
        "waiting" | "animating" | "done"
    >("waiting")

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

    if (items.length === 0) return null

    return (
        <>
            <TocHeader
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onClear={handleClearSearch}
                cursorTarget
            />
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
                    <TocSearchNoResult onClear={handleClearSearch} />
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

export { TableOfContents }
