import { useCallback, useEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"

import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { getPreferences } from "@/hooks/use-preference"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { useQueryStore } from "@/stores/query-store"

interface UseTocScrollOptions {
    items: { id: string }[]
    debouncedQuery: string
    onActiveReady?: () => void
}

const BASE_SCROLL_DELAY = 400

import { type LenisRef } from "lenis/react"

type ScrollContainerRefTarget = HTMLElement | LenisRef

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
    let curr = element
    while (curr) {
        const overflowY = window.getComputedStyle(curr).overflowY
        if (overflowY === "auto" || overflowY === "scroll") {
            return curr
        }
        curr = curr.parentElement
    }
    return null
}

function scrollElementToCenter(
    element: HTMLElement,
    behavior: ScrollBehavior = "smooth"
) {
    const parent = getScrollParent(element.parentElement)

    if (!parent) {
        element.scrollIntoView({ block: "center", behavior })
        return
    }

    const parentRect = parent.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    const relativeTop = elementRect.top - parentRect.top + parent.scrollTop
    const centerScroll =
        relativeTop - parent.clientHeight / 2 + elementRect.height / 2

    parent.scrollTo({
        top: centerScroll,
        behavior
    })
}

function getScrollElement(
    refCurrent: ScrollContainerRefTarget | null
): HTMLElement | null {
    if (!refCurrent) return null
    if ("wrapper" in refCurrent) {
        return refCurrent.wrapper
    }
    return refCurrent
}

function getActiveElement(
    container: HTMLElement | null,
    id: string | null,
    fullPath: string
) {
    if (!id || !container) return null

    let el = container.querySelector(
        `[data-toc-id="${id}"][data-toc-href="${fullPath}"]`
    )
    el ??= container.querySelector(`[data-toc-id="${id}"]`)
    return el as HTMLElement | null
}

function useTocScroll<T extends ScrollContainerRefTarget = HTMLDivElement>({
    items,
    debouncedQuery,
    onActiveReady
}: UseTocScrollOptions) {
    const pathname = usePathname()
    const isFeatureSelected = useQueryStore((s) => s.isFeatureSelected)
    const fullPath = pathname + (isFeatureSelected ? "?feature=selected" : "")
    const { isBlink } = useBrowserEngine()

    const scrollContainerRef = useRef<T>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)
    const hasNotifiedActiveRef = useRef(false)
    const onActiveReadyRef = useRef(onActiveReady)
    onActiveReadyRef.current = onActiveReady

    const allIds = useMemo(() => items.map((item) => item.id), [items])

    const rawActiveId = useScrollSpy(allIds, 40)
    const enableStartEndAutoHighlight = useTocStore(
        (s) => s.enableStartEndAutoHighlight
    )
    const activeId = useTocStore((s) => s.activeId)
    const setActiveId = useTocStore((s) => s.setActiveId)
    const lastUpdateTimestamp = useRef(0)

    const prevQueryRef = useRef(debouncedQuery)

    // Scroll to top when search results showing
    // and scroll to active item when stop searching
    useEffect(() => {
        const prev = prevQueryRef.current
        prevQueryRef.current = debouncedQuery

        if (prev === debouncedQuery) return

        if (debouncedQuery && scrollContainerRef.current) {
            const container = getScrollElement(scrollContainerRef.current)
            const scrollParent = getScrollParent(container)
            if (scrollParent) scrollParent.scrollTop = 0
        } else if (!debouncedQuery && scrollContainerRef.current) {
            const container = getScrollElement(scrollContainerRef.current)
            const activeEl = getActiveElement(container, activeId, fullPath)
            if (activeEl) {
                scrollElementToCenter(activeEl, "instant")
            }
        }
    }, [debouncedQuery, activeId, fullPath])

    // Compute initial active ID after paint to prevent React from aborting View Transitions
    useEffect(() => {
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

            // At top of page with no element past activePoint → default to first
            if (
                !initialActiveId
                && enableStartEndAutoHighlight
                && allIds.length > 0
            ) {
                initialActiveId = allIds[0]
            }
        }

        if (initialActiveId) {
            setActiveId(initialActiveId)
        } else if (!hasNotifiedActiveRef.current) {
            // Notify parent that initial activeId check is complete if there's no initial active ID.
            hasNotifiedActiveRef.current = true
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    onActiveReadyRef.current?.()
                })
            })
        }
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Bottom-of-page auto-highlight: when enableStartEndAutoHighlight is on and
    // the user scrolls to the very bottom, activate the last item
    useEffect(() => {
        if (!enableStartEndAutoHighlight || allIds.length === 0) return

        const handleScroll = () => {
            const { scrollY, innerHeight } = window
            const isBottom =
                innerHeight + scrollY
                >= document.documentElement.scrollHeight - 10
            if (isBottom) {
                setActiveId(allIds[allIds.length - 1])
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [enableStartEndAutoHighlight, allIds, setActiveId])

    // Make sure the scrollIntoView animation is finished
    // before setting the other activeIds
    useEffect(() => {
        // Skip empty string — useScrollSpy returns "" when nothing is detected yet.
        // We don't want that to override what the mount effect already set.
        if (!rawActiveId || activeId === rawActiveId) return

        let currentDelay = 0

        const { motionReduced } = getPreferences()
        const scrollDelay = motionReduced ? 0 : BASE_SCROLL_DELAY

        if (isBlink && pathname === "/portfolio" && activeId) {
            const elapsed = Date.now() - lastUpdateTimestamp.current
            if (elapsed < scrollDelay) {
                currentDelay = scrollDelay - elapsed
            }
        }

        const timer = setTimeout(() => {
            lastUpdateTimestamp.current = Date.now()
            setActiveId(rawActiveId)
        }, currentDelay)

        return () => {
            clearTimeout(timer)
        }
    }, [rawActiveId, activeId, pathname, fullPath, isBlink, setActiveId])

    // Scroll active element into view
    useEffect(() => {
        if (activeId && scrollContainerRef.current) {
            const container = getScrollElement(scrollContainerRef.current)
            if (!container) return

            if (clickedTargetRef.current) {
                if (activeId !== clickedTargetRef.current) return
                clickedTargetRef.current = null
            }

            const activeElement = getActiveElement(
                container,
                activeId,
                fullPath
            )

            const notifyReady = () => {
                if (!hasNotifiedActiveRef.current) {
                    hasNotifiedActiveRef.current = true
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            onActiveReadyRef.current?.()
                        })
                    })
                }
            }

            if (activeElement) {
                const elHref = activeElement.getAttribute("href")
                if (elHref) {
                    const url = new URL(
                        elHref,
                        window.location.origin + pathname
                    )
                    if (
                        pathname !== "/portfolio"
                        && url.pathname !== pathname
                    ) {
                        // Prevent scrolling to a stale activeId during navigation on detail pages
                        notifyReady()
                        return
                    }
                }

                const isFirst = isFirstRenderRef.current
                if (isFirst) {
                    isFirstRenderRef.current = false
                }

                const { motionReduced } = getPreferences()
                const behavior = isFirst || motionReduced ? "instant" : "smooth"

                let delay = 0
                const groupList = activeElement.closest(
                    '[data-slot="collapsible-content"]'
                )
                if (
                    groupList
                    && groupList.clientHeight + 2 < groupList.scrollHeight
                ) {
                    delay = motionReduced ? 0 : 400
                }

                if (delay > 0) {
                    const timer = setTimeout(() => {
                        const el = getActiveElement(
                            container,
                            activeId,
                            fullPath
                        )
                        if (el) {
                            scrollElementToCenter(el, behavior)
                        }
                        notifyReady()
                    }, delay)

                    return () => {
                        clearTimeout(timer)
                    }
                }

                scrollElementToCenter(activeElement, behavior)
            }

            notifyReady()
        }
    }, [activeId, pathname, fullPath])

    const getContainer = useCallback(() => {
        return getScrollElement(scrollContainerRef.current)
    }, [])

    return {
        scrollContainerRef,
        clickedTargetRef,
        getContainer
    }
}

export type { UseTocScrollOptions }
export { scrollElementToCenter, useTocScroll, useTocStore }
