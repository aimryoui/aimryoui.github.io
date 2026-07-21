"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { useScrollSpy } from "@/hooks/use-scroll-spy"

interface UseTocScrollOptions {
    items: { id: string }[]
    debouncedQuery: string
    onActiveReady?: () => void
}

const SCROLL_DELAY = 400

function useTocScroll({
    items,
    debouncedQuery,
    onActiveReady
}: UseTocScrollOptions) {
    const pathname = usePathname()
    const { isBlink } = useBrowserEngine()

    const scrollContainerRef = useRef<HTMLUListElement>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)
    const hasNotifiedActiveRef = useRef(false)

    const allIds = items.map((item) => item.id)
    const rawActiveId = useScrollSpy(allIds)
    const [activeId, setActiveId] = useState(rawActiveId)
    const lastUpdateTimestamp = useRef(0)

    const prevQueryRef = useRef(debouncedQuery)

    // Scroll to top when search results showing
    // and scroll to active item when stop searching
    useEffect(() => {
        const prev = prevQueryRef.current
        prevQueryRef.current = debouncedQuery

        if (prev === debouncedQuery) return

        if (debouncedQuery && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0
        } else if (!debouncedQuery && scrollContainerRef.current) {
            const activeEl = scrollContainerRef.current.querySelector(
                `[data-toc-id="${activeId}"]`
            )
            if (activeEl) {
                activeEl.scrollIntoView({ block: "center", behavior: "auto" })
            }
        }
    }, [debouncedQuery, activeId])

    // Compute initial active ID before paint
    useLayoutEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

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

        let currentDelay = 0

        if (isBlink && pathname === "/portfolio" && activeId) {
            const elapsed = Date.now() - lastUpdateTimestamp.current
            if (elapsed < SCROLL_DELAY) {
                currentDelay = SCROLL_DELAY - elapsed
            }
        }

        const timer = setTimeout(() => {
            lastUpdateTimestamp.current = Date.now()
            setActiveId(rawActiveId)
        }, currentDelay)

        return () => {
            clearTimeout(timer)
        }
    }, [rawActiveId, activeId, pathname, isBlink])

    // Notify parent that activeId is ready
    useEffect(() => {
        if (activeId && !hasNotifiedActiveRef.current) {
            hasNotifiedActiveRef.current = true
            onActiveReady?.()
        }
    }, [activeId, onActiveReady])

    // Scroll active element into view
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

    return {
        scrollContainerRef,
        clickedTargetRef,
        activeId
    }
}

export type { UseTocScrollOptions }
export { useTocScroll }
