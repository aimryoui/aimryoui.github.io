"use client"

import { useEffect, useRef } from "react"

import { gsap } from "gsap"

import { pxToRem } from "@/helpers/px-to-rem"
import { cn } from "@/lib/utils"

const CONTAIN_STYLE_REGEX = /\b(paint|layout|strict|content)\b/u
const WILL_CHANGE_REGEX = /\b(transform|perspective|filter)\b/u

// A position: fixed element is positioned relative to the viewport UNLESS an
// ancestor establishes a containing block (transform, perspective, filter,
// will-change of those, or contain). When that happens, the cursor's translate
// no longer maps to viewport coordinates, so we measure and compensate for it.
function getContainingBlock(element: HTMLElement | null): HTMLElement | null {
    let node = element?.parentElement ?? null
    while (node && node !== document.documentElement) {
        const style = getComputedStyle(node)
        if (
            style.transform !== "none" ||
            style.perspective !== "none" ||
            style.filter !== "none" ||
            WILL_CHANGE_REGEX.test(style.willChange) ||
            CONTAIN_STYLE_REGEX.test(style.contain)
        ) {
            return node
        }
        node = node.parentElement
    }
    return null
}

function getContainingBlockOffset(block: HTMLElement | null): {
    x: number
    y: number
} {
    if (!block) return { x: 0, y: 0 }
    const rect = block.getBoundingClientRect()
    return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop }
}

function isMobileDevice(): boolean {
    if (typeof window === "undefined") return false

    // (hover: none) and (pointer: coarse) is the most robust way to detect
    // pure touch devices (phones/tablets).
    // Touch-enabled laptops will evaluate to (hover: hover) and (pointer: fine)
    // due to their trackpad/mouse, so they won't trigger this condition.
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches
}

function computeTargetPositions(
    rect: DOMRect,
    offsetX: number,
    offsetY: number
): { x: number; y: number }[] {
    const remSize =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const border = BORDER_WIDTH * remSize
    const expand = EXPANDED_CORNER_SIZE * remSize

    return [
        {
            x: rect.left - border - offsetX,
            y: rect.top - border - offsetY
        },
        {
            x: rect.right + border - expand - offsetX,
            y: rect.top - border - offsetY
        },
        {
            x: rect.right + border - expand - offsetX,
            y: rect.bottom + border - expand - offsetY
        },
        {
            x: rect.left - border - offsetX,
            y: rect.bottom + border - expand - offsetY
        }
    ]
}

interface TargetCursorProps {
    targetSelector?: string
    lockSelector?: string
    ignoreSelector?: string
    spinDuration?: number
    hideDefaultCursor?: boolean
    cursorColor?: string
}

const HOVER_DURATION = 0.25
const BORDER_WIDTH = pxToRem(3)
const EXPANDED_CORNER_SIZE = pxToRem(12)
const REST_CORNER_SIZE = pxToRem(6)
const REST_OFFSET = pxToRem(9)

// Precomputed rest positions (corners collapsed near center)
const REST_POSITIONS = [
    { x: -REST_OFFSET, y: -REST_OFFSET },
    { x: REST_OFFSET - REST_CORNER_SIZE, y: -REST_OFFSET },
    { x: REST_OFFSET - REST_CORNER_SIZE, y: REST_OFFSET - REST_CORNER_SIZE },
    { x: -REST_OFFSET, y: REST_OFFSET - REST_CORNER_SIZE }
] as const

function TargetCursor({
    className,
    targetSelector = "[data-cursor='target']",
    lockSelector = "[data-cursor='lock']",
    ignoreSelector = "[data-cursor='ignore']",
    spinDuration = 2,
    hideDefaultCursor = true,
    cursorColor = "var(--color-highlighted)",
    ...props
}: React.ComponentProps<"div"> & TargetCursorProps) {
    const cursorRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)
    const containingBlockRef = useRef<HTMLElement | null>(null)

    // Mutable state kept outside React for perf — no re-renders needed
    const stateRef = useRef({
        corners: null as HTMLDivElement[] | null,
        spinTl: null as gsap.core.Timeline | null,
        isActive: false,
        targetPositions: null as { x: number; y: number }[] | null,
        startPositions: null as { x: number; y: number }[] | null,
        posStrength: 0, // interpolation weight for position (0=start, 1=target)
        sizeStrength: 0 // interpolation weight for size (0=REST, 1=EXPANDED)
    })

    useEffect(() => {
        if (isMobileDevice() || !cursorRef.current) return

        const cursor = cursorRef.current
        const state = stateRef.current

        // Hide custom cursor until the first mousemove so it doesn't flash
        // at the center of the screen on load/reload before the user moves
        // their pointer. Browsers don't expose cursor position without movement.
        gsap.set(cursor, { autoAlpha: 0 })

        const originalCursor = document.body.style.cursor
        let styleEl: HTMLStyleElement | null = null
        if (hideDefaultCursor) {
            styleEl = document.createElement("style")
            styleEl.textContent = /* css */ `
                body,
                body *:not(
                    ${ignoreSelector}, ${ignoreSelector} *,
                    .pswp, .pswp *,
                    input, input *
                ) {
                    cursor: none;
                }
            `
            document.head.appendChild(styleEl)
        }

        state.corners = Array.from(
            cursor.querySelectorAll<HTMLDivElement>("[data-cursor='corner']")
        )

        containingBlockRef.current = getContainingBlock(cursor)
        const getOffset = () =>
            getContainingBlockOffset(containingBlockRef.current)

        let activeTarget: Element | null = null
        let activeLockEl: Element | null = null
        let resumeTimeout: ReturnType<typeof setTimeout> | null = null

        const doLeave = () => {
            gsap.ticker.remove(tickerFn)
            state.isActive = false
            state.targetPositions = null
            state.startPositions = null
            gsap.killTweensOf(state, "posStrength,sizeStrength")
            state.posStrength = 0
            state.sizeStrength = 0
            activeTarget = null
            activeLockEl = null

            if (state.corners) {
                gsap.to(state.corners, {
                    duration: 0.15,
                    ease: "power2.out"
                })
            }

            if (state.corners) {
                gsap.killTweensOf(state.corners, "x,y")
                const tl = gsap.timeline()
                state.corners.forEach((corner, index) => {
                    tl.to(
                        corner,
                        {
                            x: `${REST_POSITIONS[index].x}rem`,
                            y: `${REST_POSITIONS[index].y}rem`,
                            width: `${REST_CORNER_SIZE}rem`,
                            height: `${REST_CORNER_SIZE}rem`,
                            duration: 0.3,
                            ease: "power3.out"
                        },
                        0
                    )
                })
            }
            resumeTimeout = setTimeout(() => {
                if (!activeTarget && cursorRef.current && state.spinTl) {
                    const currentRotation = gsap.getProperty(
                        cursorRef.current,
                        "rotation"
                    ) as number
                    const normalizedRotation = currentRotation % 360
                    state.spinTl.kill()
                    state.spinTl = gsap
                        .timeline({ repeat: -1 })
                        .to(cursorRef.current, {
                            rotation: "+=360",
                            duration: spinDuration,
                            ease: "none"
                        })
                    gsap.to(cursorRef.current, {
                        rotation: normalizedRotation + 360,
                        duration: spinDuration * (1 - normalizedRotation / 360),
                        ease: "none",
                        onComplete: () => {
                            state.spinTl?.restart()
                        }
                    })
                }
                resumeTimeout = null
            }, 50)
        }

        // Spin timeline
        if (state.spinTl) state.spinTl.kill()
        state.spinTl = gsap.timeline({ repeat: -1 }).to(cursor, {
            rotation: "+=360",
            duration: spinDuration,
            ease: "none"
        })

        // Per-frame ticker — uses gsap.set (synchronous, no tween allocation)
        const tickerFn = () => {
            if (activeTarget) {
                if (!activeTarget.isConnected) {
                    doLeave()
                    return
                }

                const rect = (
                    activeLockEl ?? activeTarget
                ).getBoundingClientRect()
                const { x: offsetX, y: offsetY } = getOffset()
                state.targetPositions = computeTargetPositions(
                    rect,
                    offsetX,
                    offsetY
                )
            }

            const {
                targetPositions,
                startPositions,
                corners,
                posStrength,
                sizeStrength
            } = state
            if (!targetPositions || !startPositions || !corners) return

            const cursorX = gsap.getProperty(cursor, "x") as number
            const cursorY = gsap.getProperty(cursor, "y") as number

            const currentCornerSize =
                REST_CORNER_SIZE +
                (EXPANDED_CORNER_SIZE - REST_CORNER_SIZE) * sizeStrength

            for (let i = 0; i < 4; i++) {
                const sx = startPositions[i].x
                const sy = startPositions[i].y
                const tx = targetPositions[i].x
                const ty = targetPositions[i].y
                gsap.set(corners[i], {
                    x: sx + (tx - sx) * posStrength - cursorX,
                    y: sy + (ty - sy) * posStrength - cursorY,
                    width: `${currentCornerSize}rem`,
                    height: `${currentCornerSize}rem`
                })
            }
        }

        // Event handlers
        let hasMoved = false
        let isHiddenByIgnore = false
        let isHiddenByLeave = false

        const moveHandler = (e: MouseEvent) => {
            const { x: offsetX, y: offsetY } = getOffset()
            gsap.set(cursor, { x: e.clientX - offsetX, y: e.clientY - offsetY })

            const isIgnored = ignoreSelector
                ? (e.target as Element).closest(ignoreSelector) !== null
                : false

            if (isIgnored) {
                if (!isHiddenByIgnore) {
                    isHiddenByIgnore = true
                    gsap.to(cursor, {
                        autoAlpha: 0,
                        duration: 0,
                        overwrite: "auto"
                    })
                }
            } else if (!hasMoved) {
                // Reveal cursor and lock in cursor hiding on first real movement
                hasMoved = true
                gsap.set(cursor, {
                    xPercent: -50,
                    yPercent: -50,
                    autoAlpha: 1
                })
            } else if (isHiddenByIgnore || isHiddenByLeave) {
                isHiddenByIgnore = false
                isHiddenByLeave = false
                gsap.to(cursor, {
                    autoAlpha: 1,
                    duration: 0,
                    overwrite: "auto"
                })
            }
        }
        window.addEventListener("mousemove", moveHandler)

        const documentLeaveHandler = () => {
            if (!hasMoved) return
            isHiddenByLeave = true
            gsap.to(cursor, {
                autoAlpha: 0,
                duration: 0,
                overwrite: "auto"
            })
        }
        document.addEventListener("mouseleave", documentLeaveHandler)

        const documentEnterHandler = () => {
            if (!isHiddenByLeave) return
            isHiddenByLeave = false
            if (!isHiddenByIgnore) {
                gsap.to(cursor, {
                    autoAlpha: 1,
                    duration: 0,
                    overwrite: "auto"
                })
            }
        }
        document.addEventListener("mouseenter", documentEnterHandler)

        const scrollHandler = () => {
            if (!activeTarget || !cursorRef.current) return
            const { x: offsetX, y: offsetY } = getOffset()
            const mouseX =
                (gsap.getProperty(cursorRef.current, "x") as number) + offsetX
            const mouseY =
                (gsap.getProperty(cursorRef.current, "y") as number) + offsetY
            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY)
            const isStillOverTarget =
                elementUnderMouse &&
                (elementUnderMouse === activeTarget ||
                    elementUnderMouse.closest(targetSelector) === activeTarget)
            if (!isStillOverTarget) {
                doLeave()
            }
        }
        window.addEventListener("scroll", scrollHandler, { passive: true })

        const mouseDownHandler = () => {
            if (!dotRef.current) return
            gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 })
            gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 })
        }
        window.addEventListener("mousedown", mouseDownHandler)

        const mouseUpHandler = () => {
            if (!dotRef.current) return
            gsap.to(dotRef.current, { scale: 1, duration: 0.3 })
            gsap.to(cursorRef.current, { scale: 1, duration: 0.2 })
        }
        window.addEventListener("mouseup", mouseUpHandler)
        window.addEventListener("dragend", mouseUpHandler)

        const enterHandler = (e: MouseEvent) => {
            const directTarget = e.target as Element
            const allTargets: Element[] = []
            let current: Element | null = directTarget
            while (current && current !== document.body) {
                if (current.matches(targetSelector)) {
                    allTargets.push(current)
                }
                current = current.parentElement
            }
            // Left all targets
            if (allTargets.length === 0) {
                if (activeTarget) {
                    doLeave()
                }
                return
            }

            const target = allTargets[0]

            if (!cursorRef.current || !state.corners) return
            // Still on the same target
            if (activeTarget === target) return

            // Moving from one target to another — skip leave animation
            const wasActive = !!activeTarget
            activeTarget = target
            activeLockEl = target.querySelector(lockSelector)

            if (resumeTimeout) {
                clearTimeout(resumeTimeout)
                resumeTimeout = null
            }
            const { corners } = state
            corners.forEach((corner) => {
                gsap.killTweensOf(corner, "x,y")
            })

            // Only stop spin/reset rotation when first entering from no-target state
            if (!wasActive) {
                gsap.killTweensOf(cursorRef.current, "rotation")
                state.spinTl?.pause()
                gsap.set(cursorRef.current, { rotation: 0 })
            }

            // Only animate color when first entering a target — skip on target-to-target
            if (!wasActive) {
                gsap.to(corners, {
                    duration: 0.15,
                    ease: "power2.out"
                })
            }

            // Use cached lock element rect if present, otherwise target rect
            const rect = (activeLockEl ?? target).getBoundingClientRect()
            const { x: offsetX, y: offsetY } = getOffset()
            const cursorX = gsap.getProperty(cursorRef.current, "x") as number
            const cursorY = gsap.getProperty(cursorRef.current, "y") as number

            // Capture current absolute corner positions as start
            state.startPositions = corners.map((corner) => ({
                x: (gsap.getProperty(corner, "x") as number) + cursorX,
                y: (gsap.getProperty(corner, "y") as number) + cursorY
            }))

            state.targetPositions = computeTargetPositions(
                rect,
                offsetX,
                offsetY
            )

            state.isActive = true
            // Always reset position strength for smooth transition
            state.posStrength = 0
            // Keep sizeStrength at 1 on target-to-target so corners don't flash small
            if (!wasActive) state.sizeStrength = 0
            gsap.ticker.add(tickerFn)

            gsap.to(state, {
                posStrength: 1,
                sizeStrength: 1,
                duration: HOVER_DURATION,
                ease: "power2.out",
                overwrite: true
            })
        }

        window.addEventListener("mouseover", enterHandler as EventListener)

        const resizeHandler = () => {
            containingBlockRef.current = getContainingBlock(cursor)
        }
        window.addEventListener("resize", resizeHandler)

        return () => {
            gsap.ticker.remove(tickerFn)
            window.removeEventListener("mousemove", moveHandler)
            window.removeEventListener(
                "mouseover",
                enterHandler as EventListener
            )
            window.removeEventListener("scroll", scrollHandler)
            window.removeEventListener("resize", resizeHandler)
            window.removeEventListener("mousedown", mouseDownHandler)
            window.removeEventListener("mouseup", mouseUpHandler)
            window.removeEventListener("dragend", mouseUpHandler)
            document.removeEventListener("mouseleave", documentLeaveHandler)
            document.removeEventListener("mouseenter", documentEnterHandler)
            state.spinTl?.kill()
            document.body.style.cursor = originalCursor
            state.isActive = false
            state.targetPositions = null
            state.startPositions = null
            state.posStrength = 0
            state.sizeStrength = 0
            styleEl?.remove()
        }
    }, [
        targetSelector,
        lockSelector,
        ignoreSelector,
        spinDuration,
        hideDefaultCursor,
        cursorColor
    ])

    return (
        <div
            ref={cursorRef}
            className={cn(
                "pointer-events-none invisible fixed left-0 top-0 z-infinite size-0 opacity-0 will-change-transform",
                className
            )}
            {...props}
        >
            <div
                ref={dotRef}
                className={cn(
                    "absolute left-1/2 top-1/2 z-1 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white will-change-transform"
                )}
            />
            <div
                data-cursor="corner"
                className="absolute left-1/2 top-1/2 border-3 border-b-0 border-r-0 will-change-transform"
                style={{
                    borderColor: cursorColor,
                    width: `${REST_CORNER_SIZE}rem`,
                    height: `${REST_CORNER_SIZE}rem`,
                    transform: `translate(${REST_POSITIONS[0].x}rem, ${REST_POSITIONS[0].y}rem)`
                }}
            />
            <div
                data-cursor="corner"
                className="absolute left-1/2 top-1/2 border-3 border-b-0 border-l-0 will-change-transform"
                style={{
                    borderColor: cursorColor,
                    width: `${REST_CORNER_SIZE}rem`,
                    height: `${REST_CORNER_SIZE}rem`,
                    transform: `translate(${REST_POSITIONS[1].x}rem, ${REST_POSITIONS[1].y}rem)`
                }}
            />
            <div
                data-cursor="corner"
                className="absolute left-1/2 top-1/2 border-3 border-l-0 border-t-0 will-change-transform"
                style={{
                    borderColor: cursorColor,
                    width: `${REST_CORNER_SIZE}rem`,
                    height: `${REST_CORNER_SIZE}rem`,
                    transform: `translate(${REST_POSITIONS[2].x}rem, ${REST_POSITIONS[2].y}rem)`
                }}
            />
            <div
                data-cursor="corner"
                className="absolute left-1/2 top-1/2 border-3 border-r-0 border-t-0 will-change-transform"
                style={{
                    borderColor: cursorColor,
                    width: `${REST_CORNER_SIZE}rem`,
                    height: `${REST_CORNER_SIZE}rem`,
                    transform: `translate(${REST_POSITIONS[3].x}rem, ${REST_POSITIONS[3].y}rem)`
                }}
            />
        </div>
    )
}

export type { TargetCursorProps }
export { TargetCursor }
