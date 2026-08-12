import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"

import { create } from "zustand"

import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { useScrollSpy } from "@/hooks/use-scroll-spy"

interface TocActiveIdStore {
    activeId: string | null
    setActiveId: (id: string | null) => void
}

const useTocActiveId = create<TocActiveIdStore>((set) => ({
    activeId: null,
    setActiveId: (id) => {
        set({ activeId: id })
    }
}))

interface UseTocScrollOptions {
    items: { id: string }[]
    debouncedQuery: string
    onActiveReady?: () => void
}

const SCROLL_DELAY = 400

function getActiveElement(
    container: HTMLElement | null,
    id: string | null,
    pathname: string
) {
    if (!id || !container) return null

    // When navigated with ?feature=selected, prioritize the Selected Works TOC
    // item (whose href contains feature=selected) over the original category item
    const isFeatureSelected =
        typeof window !== "undefined" &&
        window.location.search.includes("feature=selected")
    if (isFeatureSelected) {
        const selectedEl = container.querySelector(
            `[data-toc-id="${id}"][href*="feature=selected"]`
        )
        if (selectedEl) return selectedEl
    }

    let el = container.querySelector(
        `[data-toc-id="${id}"][href="${pathname}"]`
    )
    el ??= container.querySelector(`[data-toc-id="${id}"]`)
    return el
}

function useTocScroll<T extends HTMLElement = HTMLDivElement>({
    items,
    debouncedQuery,
    onActiveReady
}: UseTocScrollOptions) {
    const pathname = usePathname()
    const { isBlink } = useBrowserEngine()

    const scrollContainerRef = useRef<T>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)
    const hasInitialScrolledRef = useRef(false)
    const hasNotifiedActiveRef = useRef(false)

    const allIds = useMemo(() => items.map((item) => item.id), [items])
    const rawActiveId = useScrollSpy(allIds)
    const activeId = useTocActiveId((s) => s.activeId)
    const setActiveId = useTocActiveId((s) => s.setActiveId)
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
            const activeEl = getActiveElement(
                scrollContainerRef.current,
                activeId,
                pathname
            )
            if (activeEl) {
                activeEl.scrollIntoView({ block: "center", behavior: "auto" })
            }
        }
    }, [debouncedQuery, activeId, pathname])

    // Compute initial active ID before paint
    useLayoutEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const hash = window.location.hash.slice(1)
        let initialActiveId = hash && allIds.includes(hash) ? hash : rawActiveId

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
            const activeEl = getActiveElement(
                scrollContainerRef.current,
                initialActiveId,
                pathname
            )
            if (activeEl) {
                activeEl.scrollIntoView({ block: "center", behavior: "auto" })
                hasInitialScrolledRef.current = true
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
    }, [rawActiveId, activeId, pathname, isBlink, setActiveId])

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

            const activeElement = getActiveElement(
                scrollContainerRef.current,
                activeId,
                pathname
            )

            if (activeElement) {
                if (hasInitialScrolledRef.current) {
                    hasInitialScrolledRef.current = false
                    return
                }

                const elHref = activeElement.getAttribute("href")
                if (elHref) {
                    const url = new URL(
                        elHref,
                        window.location.origin + pathname
                    )
                    if (
                        pathname !== "/portfolio" &&
                        url.pathname !== pathname
                    ) {
                        // Prevent scrolling to a stale activeId during navigation on detail pages
                        return
                    }
                }

                const isFirst = isFirstRenderRef.current
                if (isFirst) {
                    isFirstRenderRef.current = false
                }

                let delay = 0
                const groupList = activeElement.closest(
                    '[data-slot="collapsible-content"]'
                )
                if (
                    !isFirst &&
                    groupList &&
                    groupList.clientHeight + 2 < groupList.scrollHeight
                ) {
                    delay = 350
                }

                const behavior = isFirst ? "auto" : "smooth"

                if (delay > 0) {
                    const timer = setTimeout(() => {
                        const el = getActiveElement(
                            scrollContainerRef.current,
                            activeId,
                            pathname
                        )
                        if (el) {
                            el.scrollIntoView({
                                block: "center",
                                behavior
                            })
                        }
                    }, delay)

                    return () => {
                        clearTimeout(timer)
                    }
                }

                activeElement.scrollIntoView({
                    block: "center",
                    behavior
                })
            }
        }
    }, [activeId, pathname])

    return {
        scrollContainerRef,
        clickedTargetRef
    }
}

export type { UseTocScrollOptions }
export { useTocActiveId, useTocScroll }
