"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type ResizeCallback = () => void
const observerCallbacks = new WeakMap<Element, ResizeCallback>()
let globalResizeObserver: ResizeObserver | null = null

function getResizeObserver() {
    if (typeof window === "undefined") return null
    globalResizeObserver ??= new ResizeObserver((entries) => {
        const callbacks = new Set<ResizeCallback>()
        for (const entry of entries) {
            const callback = observerCallbacks.get(entry.target)
            if (callback) {
                callbacks.add(callback)
            }
        }
        for (const callback of callbacks) {
            callback()
        }
    })
    return globalResizeObserver
}

function observeElements(elements: Element[], callback: ResizeCallback) {
    const observer = getResizeObserver()
    if (!observer) return () => {}

    for (const el of elements) {
        observerCallbacks.set(el, callback)
        observer.observe(el)
    }

    return () => {
        for (const el of elements) {
            observer.unobserve(el)
            observerCallbacks.delete(el)
        }
    }
}

interface MarqueeProps extends React.HTMLAttributes<
    HTMLDivElement | HTMLSpanElement
> {
    mode?: "ping-pong" | "infinity"
    direction?: "horizontal" | "vertical"
    pauseOnHover?: boolean
    duration?: number
    fadeEdges?: boolean
    as?: "div" | "span"
}

function Marquee({
    mode = "ping-pong",
    direction = "horizontal",
    pauseOnHover = true,
    duration = 5,
    fadeEdges = true,
    as: Component = "div",
    className,
    children,
    ...props
}: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement & HTMLSpanElement>(null)
    const contentRef = useRef<HTMLDivElement & HTMLSpanElement>(null)
    const singleChildRef = useRef<HTMLDivElement & HTMLSpanElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        const content = contentRef.current
        if (!container || !content) return

        const handleResize = () => {
            let overflow = false
            let distance = 0

            const isHorizontal = direction === "horizontal"

            if (mode === "ping-pong") {
                distance = isHorizontal
                    ? content.scrollWidth - container.clientWidth
                    : content.scrollHeight - container.clientHeight

                // Require at least 1px of overflow to animate, avoiding micro-jitters
                overflow = distance > 1
            } else {
                // mode === "infinity"
                const singleChild = singleChildRef.current
                if (!singleChild) return

                const childSize = isHorizontal
                    ? singleChild.scrollWidth
                    : singleChild.scrollHeight
                const containerSize = isHorizontal
                    ? container.clientWidth
                    : container.clientHeight

                overflow = childSize > containerSize
                distance = childSize
            }

            if (overflow) {
                content.style.setProperty(
                    isHorizontal
                        ? "--marquee-distance-x"
                        : "--marquee-distance-y",
                    `${distance}px`
                )
                content.style.removeProperty(
                    isHorizontal
                        ? "--marquee-distance-y"
                        : "--marquee-distance-x"
                )
                content.style.setProperty("--marquee-duration", `${duration}s`)

                if (mode === "ping-pong") {
                    container.style.setProperty(
                        "--marquee-duration",
                        `${duration}s`
                    )
                }
            } else {
                content.style.removeProperty("--marquee-distance-x")
                content.style.removeProperty("--marquee-distance-y")
                content.style.removeProperty("--marquee-duration")
                container.style.removeProperty("--marquee-duration")
            }

            setIsOverflowing(overflow)
        }

        const unobserve = observeElements([container, content], handleResize)
        return unobserve
    }, [direction, mode, duration])

    return (
        <Component
            data-slot="marquee"
            data-orientation={direction}
            data-overflowing={isOverflowing ? "" : undefined}
            ref={containerRef}
            style={
                fadeEdges && mode === "infinity"
                    ? {
                          "--marquee-mask-start": "1rem",
                          "--marquee-mask-end": "1rem"
                      }
                    : undefined
            }
            className={cn(
                "group/marquee flex flex-row overflow-hidden",
                {
                    "data-vertical": "flex-col",
                    "not-data-overflowing": "truncate",
                    "data-overflowing": [
                        "animation-ease-linear",
                        pauseOnHover
                            && "hover:animation-paused active:animation-paused",
                        fadeEdges && [
                            mode === "ping-pong"
                                && "animate-marquee-mask-ping-pong",
                            "[mask-image:linear-gradient(to_right,transparent,black_var(--marquee-mask-start,0px),black_calc(100%_-_var(--marquee-mask-end,0px)),transparent)]",
                            "rtl:[mask-image:linear-gradient(to_left,transparent,black_var(--marquee-mask-start,0px),black_calc(100%_-_var(--marquee-mask-end,0px)),transparent)]",
                            "data-vertical:[mask-image:linear-gradient(to_bottom,transparent,black_var(--marquee-mask-start,0px),black_calc(100%_-_var(--marquee-mask-end,0px)),transparent)]"
                        ]
                    ],
                    "motion-reduced":
                        "!animation-step-end data-vertical:!animate-none data-vertical:overflow-y-auto data-vertical:![mask-image:none]"
                },
                className
            )}
            {...props}
        >
            <Component
                data-slot="marquee-content"
                ref={contentRef}
                className={cn(
                    "flex shrink-0 flex-row",
                    {
                        "group-data-overflowing/marquee": [
                            "animation-ease-linear",
                            mode === "ping-pong"
                                ? "animate-marquee-ping-pong"
                                : "animate-marquee-infinity"
                        ],
                        "group-data-horizontal/marquee":
                            "[--marquee-x:calc(var(--marquee-distance-x,0px)*-1)] rtl:[--marquee-x:var(--marquee-distance-x,0px)]",
                        "group-data-vertical/marquee":
                            "flex-col [--marquee-y:calc(var(--marquee-distance-y,0px)*-1)]",
                        "motion-reduced":
                            "!animation-step-end data-vertical:!animate-none"
                    },
                    pauseOnHover && {
                        "group-data-overflowing/marquee":
                            "group-hover/marquee:animation-paused group-active/marquee:animation-paused"
                    }
                )}
            >
                <Component
                    data-slot="marquee-item"
                    ref={mode === "infinity" ? singleChildRef : undefined}
                    className={cn(
                        "shrink-0 group-data-horizontal/marquee:whitespace-nowrap"
                    )}
                >
                    {children}
                </Component>

                {mode === "infinity" && isOverflowing && (
                    <Component
                        data-slot="marquee-item-clone"
                        aria-hidden="true"
                        className={cn(
                            "shrink-0 group-data-horizontal/marquee:whitespace-nowrap"
                        )}
                    >
                        {children}
                    </Component>
                )}
            </Component>
        </Component>
    )
}

export type { MarqueeProps }
export { Marquee }
