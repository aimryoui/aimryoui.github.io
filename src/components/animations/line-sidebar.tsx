import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

import { pxToRem } from "@/helpers/px-to-rem"
import { cn } from "@/lib/utils"

type Falloff = "linear" | "smooth" | "sharp"

interface LineSidebarProps {
    itemSelector?: string
    accentColor?: string
    textColor?: string
    markerColor?: string
    proximityRadius?: number
    maxShift?: number
    falloff?: Falloff
    markerLength?: number
    markerGap?: number
    tickScale?: number
    itemGap?: number
    smoothing?: number
    className?: string
}

const FALLOFF_CURVES: Record<Falloff, (p: number) => number> = {
    linear: (p) => p,
    smooth: (p) => p * p * (3 - 2 * p),
    sharp: (p) => p * p * p
}

const FPS = 60
const FPS_INTERVAL = 1000 / FPS

function LineSidebar({
    itemSelector = ":scope > li",
    accentColor = "var(--color-foreground)",
    textColor = "#c4c4c4",
    markerColor = "var(--color-marker)",
    proximityRadius = 120,
    maxShift = 25,
    falloff = "smooth",
    markerLength = 24,
    markerGap = 0,
    tickScale = 0.5,
    itemGap = 0,
    smoothing = 100,
    className,
    ref,
    ...props
}: React.ComponentProps<"ul"> & LineSidebarProps) {
    const internalListRef = useRef<HTMLUListElement>(null)

    const listItemsRef = useRef<HTMLElement[]>([])
    const itemCentersRef = useRef<number[]>([])

    const setListRef = useCallback(
        (el: HTMLUListElement | null) => {
            internalListRef.current = el
            if (typeof ref === "function") {
                ref(el)
            } else if (ref) {
                ref.current = el
            }
        },
        [ref]
    )

    const targetsRef = useRef<number[]>([])
    const currentRef = useRef<number[]>([])
    const rafRef = useRef<number | null>(null)
    const lastRef = useRef(0)
    const smoothingRef = useRef(smoothing)

    useEffect(() => {
        smoothingRef.current = smoothing
    }, [smoothing])

    const runFrameRef = useRef<FrameRequestCallback>(() => {})

    const updateCache = useCallback(() => {
        const list = internalListRef.current
        if (!list) return

        const items = Array.from(
            list.querySelectorAll<HTMLElement>(itemSelector)
        )
        listItemsRef.current = items
        itemCentersRef.current = items.map(
            (el) => el.offsetTop + el.offsetHeight / 2
        )

        if (targetsRef.current.length !== items.length) {
            targetsRef.current = new Array<number>(items.length).fill(0)
            currentRef.current = new Array<number>(items.length).fill(0)
        }
    }, [itemSelector])

    useEffect(() => {
        const list = internalListRef.current
        if (!list) return

        updateCache()
        const observer = new MutationObserver(() => {
            updateCache()
        })
        observer.observe(list, { childList: true, subtree: true })

        return () => {
            observer.disconnect()
        }
    }, [updateCache])

    const runFrame = function frame(now: number) {
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

        for (let i = 0; i < listItems.length; i++) {
            const el = listItems[i]
            const target = Math.max(targetsRef.current[i] || 0)
            const cur = currentRef.current[i] || 0

            if (cur === 0 && target === 0) continue

            const next = cur + (target - cur) * k
            const settled = Math.abs(target - next) < 0.0015
            const value = settled ? target : next

            if (currentRef.current[i] !== value) {
                currentRef.current[i] = value
                el.style.setProperty("--effect", value.toFixed(2))
            }
            if (!settled) moving = true
        }

        rafRef.current = moving ? requestAnimationFrame(frame) : null
    }

    useLayoutEffect(() => {
        runFrameRef.current = runFrame
    })

    const startLoop = useCallback(() => {
        if (rafRef.current !== null) return
        lastRef.current = performance.now()
        rafRef.current = requestAnimationFrame((time) => {
            runFrameRef.current(time)
        })
    }, [])

    useEffect(() => {
        const list = internalListRef.current
        if (!list) return

        const handlePointerMove = (e: PointerEvent) => {
            const listRect = list.getBoundingClientRect()
            const pointerYLocal = e.clientY - listRect.top + list.scrollTop
            const ease = FALLOFF_CURVES[falloff]

            const items = listItemsRef.current
            const centers = itemCentersRef.current

            for (let i = 0; i < items.length; i++) {
                const distance = Math.abs(pointerYLocal - centers[i])
                targetsRef.current[i] = ease(
                    Math.max(0, 1 - distance / proximityRadius)
                )
            }
            startLoop()
        }

        const handlePointerLeave = () => {
            targetsRef.current = targetsRef.current.map(() => 0)
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
    }, [falloff, proximityRadius, startLoop])

    useEffect(() => {
        if (rafRef.current === null) {
            lastRef.current = performance.now()
            rafRef.current = requestAnimationFrame((time) => {
                runFrameRef.current(time)
            })
        }
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [])

    return (
        <ul
            ref={setListRef}
            data-slot="line-sidebar"
            className={cn(
                "relative flex w-full flex-col gap-[--item-gap] scrollbar-thin",
                className
            )}
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
