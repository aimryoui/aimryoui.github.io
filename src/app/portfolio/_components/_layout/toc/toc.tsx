"use client"

import { useEffect, useRef, useState } from "react"

import { Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import {
    TocList,
    type TocListProps
} from "@/portfolio/_components/_layout/toc/toc-list"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"

interface TocProps extends TocListProps {
    handleClearSearch: () => void
    shouldAnimate: boolean
}

function Toc({ handleClearSearch, shouldAnimate, ...props }: TocProps) {
    const filteredItems = useTocStore((s) => s.filteredItems)
    const rafRef = useRef<number | null>(null)
    const hasRevealed = useRef(!shouldAnimate)

    const [navRevealPhase, setNavRevealPhase] = useState<
        "waiting" | "animating" | "done"
    >(shouldAnimate ? "waiting" : "done")

    const handleActiveReady = () => {
        if (hasRevealed.current) return
        hasRevealed.current = true

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

    return (
        <nav
            aria-label="Table of contents"
            className={cn(
                "flex flex-1 flex-col overflow-auto",
                navRevealPhase === "animating" && [
                    {
                        "motion-preferred":
                            "animate-toc-reveal animation-delay-150"
                    },
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
                    <TocList onActiveReady={handleActiveReady} {...props} />
                )}
            </Tooltip>
        </nav>
    )
}

export default Toc
