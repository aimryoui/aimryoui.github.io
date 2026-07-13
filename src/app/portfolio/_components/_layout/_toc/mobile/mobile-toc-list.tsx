"use client"

import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"
import { MobileTocItemRow } from "@/portfolio/_components/_layout/_toc/mobile/mobile-toc-item-row"
import { TocDivider } from "@/portfolio/_components/_layout/_toc/toc-divider"
import { type TocItemProps } from "@/portfolio/_components/_layout/_toc/toc-item-row"
import { type TocListProps } from "@/portfolio/_components/_layout/_toc/toc-list"

const _DELAY = 400

function MobileTocList({ mode, items, filteredItems }: TocListProps) {
    const pathname = usePathname()

    const scrollContainerRef = useRef<HTMLUListElement>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)

    const allIds = items.map((item) => item.id)
    const rawActiveId = useScrollSpy(allIds)
    const [activeId, setActiveId] = useState(rawActiveId)
    const lastUpdateTimestamp = useRef(0)

    // Make sure the scrollIntoView animation is finished
    // before setting the other activeIds
    useEffect(() => {
        if (activeId === rawActiveId) return

        let delay = 0

        if (pathname === "/portfolio" && activeId) {
            const elapsed = Date.now() - lastUpdateTimestamp.current
            if (elapsed < _DELAY) {
                delay = _DELAY - elapsed
            }
        }

        const timer = setTimeout(() => {
            lastUpdateTimestamp.current = Date.now()
            setActiveId(rawActiveId)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [rawActiveId, activeId, pathname])

    const handleItemClick = useCallback((item: TocItemProps) => {
        const targetId = item.id

        if (item.mode === "route") return

        clickedTargetRef.current = targetId
        const el = document.getElementById(targetId)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        window.history.pushState(null, "", `#${targetId}`)
    }, [])

    const handleSameLinkClick = useCallback(() => {
        window.dispatchEvent(new CustomEvent("portfolio:main-flash"))
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
        <ul
            ref={scrollContainerRef}
            className={cn(
                "group overflow-y-scroll overscroll-contain scroll-auto py-3 pb-[30vh] will-change-[opacity] scrollbar-thin"
            )}
        >
            {filteredItems.map((item) => {
                if (item.hidden) return null

                return (
                    <Fragment key={item.id}>
                        {(item.depth === 2 || item.depth === 4) && (
                            <TocDivider id={item.id} className="my-5" />
                        )}

                        <MobileTocItemRow
                            mode={mode}
                            item={item}
                            isActive={activeId === item.id}
                            onClick={handleItemClick}
                            onSameLinkClick={handleSameLinkClick}
                        />
                    </Fragment>
                )
            })}
        </ul>
    )
}

export { MobileTocList }
