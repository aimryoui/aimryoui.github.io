"use client"

import { Fragment, useCallback, useEffect, useRef } from "react"

import { stagger } from "motion/react"
import * as m from "motion/react-m"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/_toc/toc-divider"
import {
    TocItemRow,
    type TocItemProps
} from "@/portfolio/_components/_layout/_toc/toc-item-row"

interface TocListProps {
    items: TocItemProps[]
    filteredItems: TocItemProps[]
    hasPageMounted: boolean
    setHasPageMounted: (value: boolean) => void
}

const ulVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            delayChildren: stagger(0.025, {
                startDelay: -0.1,
                ease: "easeOut"
            })
        }
    }
}

function TocList({
    items,
    filteredItems,
    hasPageMounted,
    setHasPageMounted
}: TocListProps) {
    const scrollContainerRef = useRef<HTMLUListElement>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)

    const allIds = items.map((item) => item.id)
    const activeId = useScrollSpy(allIds)

    const handleItemClick = useCallback((targetId: string) => {
        clickedTargetRef.current = targetId
        const el = document.getElementById(targetId)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        window.history.pushState(null, "", `#${targetId}`)
    }, [])

    useEffect(() => {
        if (activeId && scrollContainerRef.current) {
            if (clickedTargetRef.current) {
                if (activeId !== clickedTargetRef.current) return
                clickedTargetRef.current = null
            }

            const activeElement = scrollContainerRef.current.querySelector(
                `[data-toc-id="${activeId}"]`
            )

            if (activeElement) {
                if (isFirstRenderRef.current) {
                    isFirstRenderRef.current = false
                    activeElement.scrollIntoView({
                        block: "center",
                        behavior: "auto"
                    })
                } else {
                    activeElement.scrollIntoView({
                        block: "center",
                        behavior: "smooth"
                    })
                }
            }
        }
    }, [activeId])

    return (
        <m.ul
            variants={ulVariants}
            initial={hasPageMounted ? false : "hidden"}
            animate={"visible"}
            onAnimationComplete={() => {
                if (!hasPageMounted) setHasPageMounted(true)
            }}
            ref={scrollContainerRef}
            className={cn(
                "group overflow-y-scroll overscroll-contain scroll-auto py-3.25 text-sm will-change-[opacity] scrollbar-thin"
            )}
        >
            {filteredItems.map((item) => {
                if (item.hidden) return null

                return (
                    <Fragment key={item.id}>
                        {(item.depth === 2 || item.depth === 4) && (
                            <TocDivider />
                        )}

                        <TocItemRow
                            item={item}
                            isActive={activeId === item.id}
                            onClick={handleItemClick}
                        />
                    </Fragment>
                )
            })}
        </m.ul>
    )
}

export type { TocListProps }
export { TocList }
