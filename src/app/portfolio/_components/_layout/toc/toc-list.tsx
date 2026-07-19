"use client"

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { LineSidebar } from "@/components/animations/line-sidebar"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/toc/toc-item-row"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocListProps {
    mode: PortfolioMode
    items: TocItemProps[]
    filteredItems: TocItemProps[]
    onActiveReady?: () => void
}

function handleSameLinkClick() {
    window.dispatchEvent(new CustomEvent("portfolio:main-flash"))
}

const _DELAY = 400

function TocList({ mode, items, filteredItems, onActiveReady }: TocListProps) {
    const pathname = usePathname()

    const scrollContainerRef = useRef<HTMLUListElement>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)
    const hasNotifiedActiveRef = useRef(false)

    const allIds = items.map((item) => item.id)
    const rawActiveId = useScrollSpy(allIds)
    const [activeId, setActiveId] = useState(rawActiveId)
    const lastUpdateTimestamp = useRef(0)

    useLayoutEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        // Compute initial active ID independently (useScrollSpy hasn't fired)
        const hash = window.location.hash.slice(1)
        let initialActiveId = hash && allIds.includes(hash) ? hash : ""

        if (!initialActiveId) {
            const activePoint = window.innerHeight * 0.4
            for (let i = allIds.length - 1; i >= 0; i--) {
                const el = document.getElementById(allIds[i])
                if (!el) continue
                const rect = el.getBoundingClientRect()
                if (rect.width === 0 && rect.height === 0) continue
                if (rect.top <= activePoint) {
                    initialActiveId = allIds[i]
                    break
                }
            }
        }

        // Set active ID and scroll TOC to center the active element (instant, before paint)
        if (initialActiveId) {
            setActiveId(initialActiveId)
            const activeEl = container.querySelector(
                `[data-toc-id="${initialActiveId}"]`
            )
            if (activeEl) {
                activeEl.scrollIntoView({ block: "center", behavior: "auto" })
                isFirstRenderRef.current = false
            }
        }

        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    // Notify parent when activeId first becomes truthy (initial scroll is done)
    useEffect(() => {
        if (activeId && !hasNotifiedActiveRef.current) {
            hasNotifiedActiveRef.current = true
            onActiveReady?.()
        }
    }, [activeId, onActiveReady])

    const handleItemClick = (item: TocItemProps) => {
        const targetId = item.id

        if (item.mode === "route") return

        clickedTargetRef.current = targetId
        const el = document.getElementById(targetId)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        window.history.pushState(null, "", `#${targetId}`)
    }

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
        <LineSidebar
            ref={scrollContainerRef}
            itemSelector="li:not([role='separator'])"
            className={cn(
                "group block overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-3",
                "scroll-fade-y scroll-fade-18"
            )}
        >
            {filteredItems.map((item) => {
                if (item.hidden) return null

                return (
                    <Fragment key={item.id}>
                        {(item.depth === 2 || item.depth === 4) && (
                            <TocDivider id={item.id} />
                        )}
                        <TocItemRow
                            mode={mode}
                            item={item}
                            isActive={activeId === item.id}
                            onClick={handleItemClick}
                            onSameLinkClick={handleSameLinkClick}
                        />
                    </Fragment>
                )
            })}
        </LineSidebar>
    )
}

export type { TocListProps }
export { TocList }
