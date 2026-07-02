"use client"

import {
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react"
import { usePathname } from "next/navigation"

import { stagger } from "motion/react"
import * as m from "motion/react-m"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/_toc/toc-divider"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/_toc/toc-item-row"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocListProps {
    mode: PortfolioMode
    items: TocItemProps[]
    filteredItems: TocItemProps[]
    hasPageMounted: boolean
    setHasPageMounted: (value: boolean) => void
}

function getUlVariants(fromIndex: number) {
    return {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1,
                delayChildren: stagger(0.025, {
                    startDelay: -0.1,
                    ease: "easeOut",
                    from: fromIndex
                })
            }
        }
    }
}

const _DELAY = 400

function TocList({
    mode,
    items,
    filteredItems,
    hasPageMounted,
    setHasPageMounted
}: TocListProps) {
    const pathname = usePathname()

    const scrollContainerRef = useRef<HTMLUListElement>(null)
    const clickedTargetRef = useRef<string | null>(null)
    const isFirstRenderRef = useRef(true)

    const allIds = useMemo(() => items.map((item) => item.id), [items])
    const rawActiveId = useScrollSpy(allIds)
    const [activeId, setActiveId] = useState(rawActiveId)
    const lastUpdateTimestamp = useRef(0)

    // Stagger "from" index & animation gate, computed once before first paint.
    // null = waiting for useLayoutEffect to compute, number = ready to animate.
    const [staggerFrom, setStaggerFrom] = useState<number | null>(
        hasPageMounted ? 0 : null
    )

    const ulVariants = useMemo(
        () => getUlVariants(staggerFrom ?? 0),
        [staggerFrom]
    )

    // Before the first paint: figure out which TOC section is initially active
    // (useScrollSpy hasn't fired yet), scroll the TOC container to center it,
    // then find which <li> is at the top of the visible area to start stagger.
    useLayoutEffect(() => {
        if (hasPageMounted) return

        const container = scrollContainerRef.current
        if (!container) {
            setStaggerFrom(0)
            return
        }

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

        // Scroll TOC to center the active element (instant, before paint)
        if (initialActiveId) {
            const activeEl = container.querySelector(
                `[data-toc-id="${initialActiveId}"]`
            )
            if (activeEl) {
                activeEl.scrollIntoView({ block: "center", behavior: "auto" })
                isFirstRenderRef.current = false
            }
        }

        // Find the stagger index of the first visible <li>
        const containerRect = container.getBoundingClientRect()
        const listItems = container.querySelectorAll(":scope > li")
        let firstVisibleIdx = 0
        for (let i = 0; i < listItems.length; i++) {
            const rect = listItems[i].getBoundingClientRect()
            if (rect.bottom > containerRect.top) {
                firstVisibleIdx = i
                break
            }
        }

        setStaggerFrom(firstVisibleIdx)
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
        <m.ul
            variants={ulVariants}
            initial={hasPageMounted ? false : "hidden"}
            animate={staggerFrom === null ? "hidden" : "visible"}
            onAnimationComplete={() => {
                if (!hasPageMounted) setHasPageMounted(true)
            }}
            ref={scrollContainerRef}
            className={cn(
                "group overflow-y-scroll overscroll-contain scroll-auto py-3 text-sm will-change-[opacity] scrollbar-thin",
                "scroll-fade-y scroll-fade-24",
                {
                    lg: "pb-[30vh]"
                }
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
        </m.ul>
    )
}

export type { TocListProps }
export { TocList }
