import { useCallback, useEffect, useRef } from "react"

import { type HTMLMotionProps } from "motion/react"
import * as m from "motion/react-m"

import { pxToRem } from "@/helpers/px-to-rem"
import { cn } from "@/lib/utils"

type Falloff = "linear" | "smooth" | "sharp"

interface LineSidebarProps {
    itemSelector?: string
    accentColor?: string
    textColor?: string
    markerColor?: string
    showMarker?: boolean
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

const FPS = 120
const FPS_INTERVAL = 1000 / FPS

function LineSidebar({
    itemSelector = ":scope > li",
    accentColor = "var(--color-default)",
    textColor = "#c4c4c4",
    markerColor = "var(--color-marker)",
    showMarker = true,
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
}: HTMLMotionProps<"ul"> & LineSidebarProps) {
    const internalListRef = useRef<HTMLUListElement>(null)
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

    // Single rAF loop that eases every item's --effect toward its target using
    // frame-rate independent exponential smoothing, so color, shift and scale
    // all move together without staggering CSS transitions.
    const runFrame = useCallback(
        function frame(now: number) {
            const list = internalListRef.current
            if (!list) return

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
            const listItems = Array.from(
                list.querySelectorAll(itemSelector)
            ) as HTMLLIElement[]
            for (let i = 0; i < listItems.length; i++) {
                const el = listItems[i]
                const target = Math.max(targetsRef.current[i] || 0)
                const cur = currentRef.current[i] || 0
                const next = cur + (target - cur) * k
                const settled = Math.abs(target - next) < 0.0015
                const value = settled ? target : next
                currentRef.current[i] = value
                el.style.setProperty("--effect", value.toFixed(4))
                if (!settled) moving = true
            }

            rafRef.current = moving ? requestAnimationFrame(frame) : null
        },
        [itemSelector]
    )

    const startLoop = useCallback(() => {
        if (rafRef.current !== null) return
        lastRef.current = performance.now()
        rafRef.current = requestAnimationFrame(runFrame)
    }, [runFrame])

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLUListElement>) => {
            const list = internalListRef.current
            if (!list) return
            const pointerY = e.clientY
            const ease = FALLOFF_CURVES[falloff]
            const listItems = Array.from(
                list.querySelectorAll(itemSelector)
            ) as HTMLLIElement[]
            for (let i = 0; i < listItems.length; i++) {
                const el = listItems[i]
                const itemRect = el.getBoundingClientRect()
                const center = itemRect.top + itemRect.height / 2
                const distance = Math.abs(pointerY - center)
                targetsRef.current[i] = ease(
                    Math.max(0, 1 - distance / proximityRadius)
                )
            }
            startLoop()
        },
        [falloff, proximityRadius, startLoop, itemSelector]
    )

    const handlePointerLeave = useCallback(() => {
        targetsRef.current = targetsRef.current.map(() => 0)
        startLoop()
    }, [startLoop])

    useEffect(() => {
        startLoop()
    }, [startLoop])

    useEffect(
        () => () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        },
        []
    )

    return (
        <m.ul
            ref={setListRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={cn(
                "flex w-full flex-col gap-[var(--item-gap)] will-change-[opacity] scrollbar-thin",
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
