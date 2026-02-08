"use client"

import { memo, useCallback, useEffect, useMemo, useRef } from "react"

import { motion, stagger } from "motion/react"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"
import { TocItemRow } from "@/portfolio/_components/_layout/_toc/toc-item-row"

interface TocItem {
    id: string
    label: string
    depth: 1 | 2 | 3
}

interface TocListProps {
    items: TocItem[]
    filteredItems: TocItem[]
    hasPageMounted: boolean
    setHasPageMounted: (value: boolean) => void
}

export const TocList = memo(
    ({
        items,
        filteredItems,
        hasPageMounted,
        setHasPageMounted
    }: TocListProps) => {
        const scrollContainerRef = useRef<HTMLUListElement>(null)
        const clickedTargetRef = useRef<string | null>(null)
        const isFirstRenderRef = useRef(true)

        const allIds = useMemo(() => items.map((item) => item.id), [items])
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
            <motion.ul
                variants={{
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
                }}
                initial={hasPageMounted ? "visible" : "hidden"}
                animate="visible"
                onAnimationComplete={() => {
                    setHasPageMounted(true)
                }}
                ref={scrollContainerRef}
                className={cn(
                    "group scrollbar-thin flex-1 overflow-y-scroll overscroll-contain scroll-auto py-4 text-sm will-change-[opacity]"
                )}
            >
                {filteredItems.map((item) => (
                    <TocItemRow
                        key={item.id}
                        item={item}
                        isActive={activeId === item.id}
                        onClick={handleItemClick}
                    />
                ))}
            </motion.ul>
        )
    }
)

TocList.displayName = "TocList"
