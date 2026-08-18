import { useCallback, useEffect, useRef } from "react"

import { ScrollArea, type ScrollAreaProps } from "@/components/ui/scroll-area"
import { pxToRem } from "@/helpers/px-to-rem"
import { usePreference } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"

interface LineSidebarProps extends ScrollAreaProps {
    itemSelector?: string
    accentColor?: string
    textColor?: string
    markerColor?: string
    proximityRadius?: number
    maxShift?: number
    markerLength?: number
    markerGap?: number
    tickScale?: number
    itemGap?: number
    smoothing?: number
    className?: string
}

const FPS = 60
const FPS_INTERVAL = 1000 / FPS

function LineSidebar({
    itemSelector = ":scope li",
    accentColor = "var(--color-foreground)",
    textColor = "#c4c4c4",
    markerColor = "var(--color-marker)",
    proximityRadius = 120,
    maxShift = 25,
    markerLength = 24,
    markerGap = 0,
    tickScale = 0.5,
    itemGap = 0,
    smoothing = 100,
    className,
    ref,
    ...props
}: LineSidebarProps) {
    const internalListRef = useRef<HTMLDivElement>(null)

    const isEffectEnabled = usePreference().effectLineSidebar
    const { motionReduced } = usePreference()
    const isActive = isEffectEnabled && !motionReduced

    const listItemsRef = useRef<HTMLElement[]>([])
    const itemCentersRef = useRef<number[]>([])
    const statesRef = useRef(
        new WeakMap<HTMLElement, { target: number; current: number }>()
    )

    const setListRef = useCallback(
        (el: HTMLDivElement | null) => {
            internalListRef.current = el
            if (typeof ref === "function") {
                ref(el)
            } else if (ref) {
                ref.current = el
            }
        },
        [ref]
    )

    const rafRef = useRef<number | null>(null)
    const lastRef = useRef(0)
    const smoothingRef = useRef(smoothing)

    useEffect(() => {
        smoothingRef.current = smoothing
    }, [smoothing])

    const updateCache = useCallback(() => {
        const list = internalListRef.current
        if (!list) return

        const allItems = Array.from(
            list.querySelectorAll<HTMLElement>(itemSelector)
        )
        const visibleItems: HTMLElement[] = []
        const centers: number[] = []

        for (const el of allItems) {
            if (el.hasAttribute("hidden") || el.closest("[hidden]")) {
                // Natively reset CSS variable
                el.style.setProperty("--effect", "0")
                // Wipe internal state so it starts from 0 if shown again
                const state = statesRef.current.get(el)
                if (state) {
                    state.target = 0
                    state.current = 0
                }
            } else {
                visibleItems.push(el)
                centers.push(el.offsetTop + el.offsetHeight / 2)
            }
        }

        listItemsRef.current = visibleItems
        itemCentersRef.current = centers
    }, [itemSelector])

    useEffect(() => {
        if (!isActive) return

        const list = internalListRef.current
        if (!list) return

        updateCache()

        const resizeObserver = new ResizeObserver(() => {
            updateCache()
        })

        // Observe the container (handles resize) and all children (handles height animations)
        resizeObserver.observe(list)
        Array.from(list.children).forEach((child) => {
            resizeObserver.observe(child)
        })

        // Observe mutations for childList AND attributes (hidden)
        const mutationObserver = new MutationObserver((mutations) => {
            if (
                mutations.some(
                    (m) =>
                        m.type === "childList" ||
                        (m.type === "attributes" &&
                            m.attributeName === "hidden")
                )
            ) {
                resizeObserver.disconnect()
                resizeObserver.observe(list)
                Array.from(list.children).forEach((c) => {
                    resizeObserver.observe(c)
                })
                updateCache()
            }
        })

        mutationObserver.observe(list, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["hidden"]
        })

        return () => {
            resizeObserver.disconnect()
            mutationObserver.disconnect()
        }
    }, [updateCache, isActive])

    const runFrame = useCallback(function frame(now: number) {
        if (!internalListRef.current) {
            rafRef.current = null
            return
        }

        const elapsed = now - lastRef.current
        if (elapsed < FPS_INTERVAL) {
            rafRef.current = requestAnimationFrame(frame)
            return
        }

        const dt = Math.min(elapsed / 1000, 0.05)
        lastRef.current = now - (elapsed % FPS_INTERVAL)
        const tau = Math.max(smoothingRef.current, 1) / 1000
        const k = 1 - Math.exp(-dt / tau)

        let moving = false
        const listItems = listItemsRef.current

        for (const el of listItems) {
            let state = statesRef.current.get(el)
            if (!state) {
                state = { target: 0, current: 0 }
                statesRef.current.set(el, state)
            }

            const target = state.target
            const cur = state.current

            if (cur === 0 && target === 0) continue

            const next = cur + (target - cur) * k
            const settled = Math.abs(target - next) < 0.0015
            const value = settled ? target : next

            if (state.current !== value) {
                state.current = value
                el.style.setProperty("--effect", value.toFixed(2))
            }
            if (!settled) moving = true
        }

        rafRef.current = moving ? requestAnimationFrame(frame) : null
    }, [])

    const startLoop = useCallback(() => {
        if (rafRef.current !== null) return
        lastRef.current = performance.now()
        rafRef.current = requestAnimationFrame(runFrame)
    }, [runFrame])

    useEffect(() => {
        if (!isActive) return

        const list = internalListRef.current
        if (!list) return

        const handlePointerMove = (e: PointerEvent) => {
            const listRect = list.getBoundingClientRect()
            const pointerYLocal = e.clientY - listRect.top + list.scrollTop

            const items = listItemsRef.current
            const centers = itemCentersRef.current

            for (let i = 0; i < items.length; i++) {
                const distance = Math.abs(pointerYLocal - centers[i])
                const p = Math.max(0, 1 - distance / proximityRadius)

                let state = statesRef.current.get(items[i])
                if (!state) {
                    state = { target: 0, current: 0 }
                    statesRef.current.set(items[i], state)
                }
                state.target = p * p * (3 - 2 * p)
            }
            startLoop()
        }

        const handlePointerLeave = () => {
            for (const el of listItemsRef.current) {
                const state = statesRef.current.get(el)
                if (state) state.target = 0
            }
            startLoop()
        }

        list.addEventListener("pointermove", handlePointerMove, {
            passive: true
        })
        list.addEventListener("pointerleave", handlePointerLeave, {
            passive: true
        })

        return () => {
            list.removeEventListener("pointermove", handlePointerMove)
            list.removeEventListener("pointerleave", handlePointerLeave)
        }
    }, [proximityRadius, startLoop, isActive])

    useEffect(() => {
        if (!isActive) return

        if (rafRef.current === null) {
            lastRef.current = performance.now()
            rafRef.current = requestAnimationFrame(runFrame)
        }
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [runFrame, isActive])

    return (
        <ScrollArea
            ref={setListRef}
            className={cn("w-full gap-[--item-gap]", className)}
            style={{
                "--accent-color": accentColor,
                "--text-color": textColor,
                "--marker-color": markerColor,
                "--marker-length": `${pxToRem(markerLength)}rem`,
                "--marker-gap": `${pxToRem(markerGap)}rem`,
                "--tick-scale": tickScale,
                "--max-shift": `${pxToRem(maxShift)}rem`,
                "--item-gap": `${pxToRem(itemGap)}rem`,
                "--smoothing": `${smoothing}ms`
            }}
            {...props}
        />
    )
}

export type { LineSidebarProps }
export { LineSidebar }
