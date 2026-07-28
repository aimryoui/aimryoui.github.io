"use client"

import { useEffect, useRef } from "react"

import { gsap } from "gsap"

import { useDevice } from "@/hooks/use-device"
import { cn } from "@/lib/utils"

type CursorSelector = "target" | "lock" | "ignore" | undefined

const CONTAIN_STYLE_REGEX = /\b(paint|layout|strict|content)\b/u
const WILL_CHANGE_REGEX = /\b(transform|perspective|filter)\b/u

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

function shouldDisable(isTouchDevice: boolean): boolean {
    if (typeof window === "undefined") return false
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return true
    }
    return isTouchDevice
}

interface TargetCursorProps {
    targetSelector?: string
    lockSelector?: string
    ignoreSelector?: string
    inputSelector?: string
    spinDuration?: number
    hideDefaultCursor?: boolean
    cursorColor?: string
}

const HOVER_DURATION = 0.25

// Base values (we will compute actual px based on rem at runtime for GSAP)
const BASE_BORDER_W = 3
const BASE_EXPANDED_SIZE = 12
const BASE_REST_SIZE = 6
const BASE_REST_OFF = 9

function TargetCursor({
    className,
    targetSelector = "[data-cursor='target']",
    lockSelector = "[data-cursor='lock']",
    ignoreSelector = "[data-cursor='ignore']",
    inputSelector = "[data-cursor='input']",
    spinDuration = 2,
    hideDefaultCursor = true,
    cursorColor = "var(--color-highlighted)",
    ...props
}: React.ComponentProps<"div"> & TargetCursorProps) {
    const { isTouchDevice } = useDevice()

    const rootRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const containingBlockRef = useRef<HTMLElement | null>(null)

    const stateRef = useRef({
        corners: null as HTMLDivElement[] | null,
        spinTl: null as gsap.core.Timeline | null,
        resumeTween: null as gsap.core.Tween | null,
        isActive: false,

        // Track the real mouse pos to resume wrapper instantly on leave
        mouseX: 0,
        mouseY: 0,

        // Target interpolation tracking
        startX: 0,
        startY: 0,
        cornerStarts: null as { x: number; y: number }[] | null,

        posStrength: 0,
        sizeStrength: 0
    })

    useEffect(() => {
        if (
            shouldDisable(isTouchDevice) ||
            !rootRef.current ||
            !wrapperRef.current ||
            !dotRef.current
        )
            return

        const root = rootRef.current
        const wrapper = wrapperRef.current
        const dot = dotRef.current
        const state = stateRef.current

        // Calculate actual pixel values based on current root font size
        const remSize =
            parseFloat(getComputedStyle(document.documentElement).fontSize) ||
            16
        const borderPx = (BASE_BORDER_W / 16) * remSize
        const expandedPx = (BASE_EXPANDED_SIZE / 16) * remSize
        const restPx = (BASE_REST_SIZE / 16) * remSize
        const offsetPx = (BASE_REST_OFF / 16) * remSize

        const restPositions = [
            { x: -offsetPx, y: -offsetPx },
            { x: offsetPx - restPx, y: -offsetPx },
            { x: offsetPx - restPx, y: offsetPx - restPx },
            { x: -offsetPx, y: offsetPx - restPx }
        ]

        gsap.set(root, { autoAlpha: 0 })

        const originalCursor = document.body.style.cursor
        let styleEl: HTMLStyleElement | null = null
        if (hideDefaultCursor) {
            styleEl = document.createElement("style")
            styleEl.textContent = /* css */ `
                body,
                body *:not(
                    ${ignoreSelector}, ${ignoreSelector} *,
                    ${inputSelector}, ${inputSelector} *,
                    .pswp, .pswp *,
                    input, input *
                ) { cursor: none; }
            `
            document.head.appendChild(styleEl)
        }

        state.corners = Array.from(
            wrapper.querySelectorAll<HTMLDivElement>("[data-cursor='corner']")
        )

        // Setup initial corners state in wrapper
        state.corners.forEach((corner, i) => {
            gsap.set(corner, {
                x: restPositions[i].x,
                y: restPositions[i].y,
                width: restPx,
                height: restPx
            })
        })

        containingBlockRef.current = getContainingBlock(root)
        const getOffset = () =>
            getContainingBlockOffset(containingBlockRef.current)

        let activeTarget: Element | null = null
        let activeLockEl: Element | null = null
        let resumeTimeout: ReturnType<typeof setTimeout> | null = null

        let hasMoved = false
        let isHiddenByIgnore = false
        let isHiddenByLeave = false
        let isHiddenByInput = false

        const updateVisibility = () => {
            const isHidden = !hasMoved || isHiddenByIgnore || isHiddenByLeave
            gsap.set(root, { autoAlpha: isHidden ? 0 : 1, overwrite: "auto" })
            gsap.set(dot, {
                autoAlpha: isHidden || isHiddenByInput ? 0 : 1,
                overwrite: "auto"
            })

            if (isHidden) {
                state.resumeTween?.pause()
                state.spinTl?.pause()
            } else if (!activeTarget) {
                if (state.resumeTween && state.resumeTween.progress() < 1) {
                    state.resumeTween.play()
                } else {
                    state.spinTl?.play()
                }
            }
        }

        const doLeave = () => {
            gsap.ticker.remove(tickerFn)
            state.isActive = false
            activeTarget = null
            activeLockEl = null

            // Calc offset needed so corners don't jump visually when wrapper snaps back to mouse
            const currentWrapperX = gsap.getProperty(wrapper, "x") as number
            const currentWrapperY = gsap.getProperty(wrapper, "y") as number
            const dx = currentWrapperX - state.mouseX
            const dy = currentWrapperY - state.mouseY

            gsap.set(wrapper, { x: state.mouseX, y: state.mouseY })

            if (state.corners) {
                gsap.killTweensOf(state.corners, "x,y,width,height")
                const tl = gsap.timeline()

                state.corners.forEach((corner, index) => {
                    const currentX = gsap.getProperty(corner, "x") as number
                    const currentY = gsap.getProperty(corner, "y") as number

                    // Counter-offset then animate to rest
                    gsap.set(corner, { x: currentX + dx, y: currentY + dy })
                    tl.to(
                        corner,
                        {
                            x: restPositions[index].x,
                            y: restPositions[index].y,
                            width: restPx,
                            height: restPx,
                            duration: 0.3,
                            ease: "power3.out"
                        },
                        0
                    )
                })
            }

            resumeTimeout = setTimeout(() => {
                if (!activeTarget && state.spinTl) {
                    const currentRotation = gsap.getProperty(
                        wrapper,
                        "rotation"
                    ) as number
                    const normalizedRotation = currentRotation % 360
                    state.spinTl.kill()
                    state.spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, {
                        rotation: "+=360",
                        duration: spinDuration,
                        ease: "none"
                    })
                    state.spinTl.pause()

                    state.resumeTween?.kill()
                    const isHidden =
                        !hasMoved || isHiddenByIgnore || isHiddenByLeave
                    gsap.set(wrapper, { rotation: normalizedRotation })

                    state.resumeTween = gsap.to(wrapper, {
                        rotation: 360,
                        duration: spinDuration * (1 - normalizedRotation / 360),
                        ease: "none",
                        paused: isHidden,
                        onComplete: () => {
                            if (
                                hasMoved &&
                                !isHiddenByIgnore &&
                                !isHiddenByLeave
                            ) {
                                state.spinTl?.restart()
                            }
                        }
                    })
                }
                resumeTimeout = null
            }, 50)
        }

        if (state.spinTl) state.spinTl.kill()
        if (state.resumeTween) state.resumeTween.kill()
        state.spinTl = gsap.timeline({ repeat: -1, paused: true }).to(wrapper, {
            rotation: "+=360",
            duration: spinDuration,
            ease: "none"
        })

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

                // Target center
                const cx = rect.left + rect.width / 2 - offsetX
                const cy = rect.top + rect.height / 2 - offsetY

                const w = rect.width / 2
                const h = rect.height / 2

                const tx = [
                    -w - borderPx,
                    w + borderPx - expandedPx,
                    w + borderPx - expandedPx,
                    -w - borderPx
                ]
                const ty = [
                    -h - borderPx,
                    -h - borderPx,
                    h + borderPx - expandedPx,
                    h + borderPx - expandedPx
                ]

                const {
                    posStrength,
                    sizeStrength,
                    startX,
                    startY,
                    cornerStarts
                } = state

                // Smoothly snap wrapper to target center
                gsap.set(wrapper, {
                    x: startX + (cx - startX) * posStrength,
                    y: startY + (cy - startY) * posStrength
                })

                // Locally expand corners based on target bounds
                const currentCornerSize =
                    restPx + (expandedPx - restPx) * sizeStrength
                for (let i = 0; i < 4; i++) {
                    const sx = cornerStarts![i].x
                    const sy = cornerStarts![i].y
                    gsap.set(state.corners![i], {
                        x: sx + (tx[i] - sx) * posStrength,
                        y: sy + (ty[i] - sy) * posStrength,
                        width: currentCornerSize,
                        height: currentCornerSize
                    })
                }
            }
        }

        const moveHandler = (e: MouseEvent) => {
            const { x: offsetX, y: offsetY } = getOffset()
            const mx = e.clientX - offsetX
            const my = e.clientY - offsetY

            state.mouseX = mx
            state.mouseY = my

            // Dot ALWAYS follows mouse
            gsap.set(dot, { x: mx, y: my })

            // Wrapper ONLY follows mouse when not snapped to a target
            if (!state.isActive) {
                gsap.set(wrapper, { x: mx, y: my })
            }

            const isIgnored = ignoreSelector
                ? (e.target as Element).closest(ignoreSelector) !== null
                : false
            const isInput = inputSelector
                ? (e.target as Element).closest(inputSelector) !== null
                : false

            let visibilityChanged = false

            if (!hasMoved) {
                hasMoved = true
                visibilityChanged = true
            }

            if (isIgnored) {
                if (!isHiddenByIgnore) {
                    isHiddenByIgnore = true
                    visibilityChanged = true
                }
            } else if (isHiddenByIgnore || isHiddenByLeave) {
                isHiddenByIgnore = false
                isHiddenByLeave = false
                visibilityChanged = true
            }

            if (isInput) {
                if (!isHiddenByInput) {
                    isHiddenByInput = true
                    visibilityChanged = true
                }
            } else if (isHiddenByInput) {
                isHiddenByInput = false
                visibilityChanged = true
            }

            if (visibilityChanged) updateVisibility()
        }
        window.addEventListener("mousemove", moveHandler)

        const documentLeaveHandler = () => {
            if (!hasMoved) return
            isHiddenByLeave = true
            updateVisibility()
        }
        document.documentElement.addEventListener(
            "mouseleave",
            documentLeaveHandler
        )

        const documentEnterHandler = () => {
            if (!isHiddenByLeave) return
            isHiddenByLeave = false
            updateVisibility()
        }
        document.documentElement.addEventListener(
            "mouseenter",
            documentEnterHandler
        )

        const visibilityHandler = () => {
            if (document.hidden) {
                isHiddenByLeave = true
                updateVisibility()
            }
        }
        document.addEventListener("visibilitychange", visibilityHandler)

        const blurHandler = () => {
            if (!hasMoved) return
            isHiddenByLeave = true
            updateVisibility()
        }
        window.addEventListener("blur", blurHandler)

        const scrollHandler = () => {
            if (!activeTarget) return
            const { x: offsetX, y: offsetY } = getOffset()
            const mouseX = state.mouseX + offsetX
            const mouseY = state.mouseY + offsetY
            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY)
            const isStillOverTarget =
                elementUnderMouse &&
                (elementUnderMouse === activeTarget ||
                    elementUnderMouse.closest(targetSelector) ===
                        activeTarget ||
                    (inputSelector
                        ? elementUnderMouse.closest(inputSelector) ===
                          activeTarget
                        : false))

            if (!isStillOverTarget) doLeave()
        }
        window.addEventListener("scroll", scrollHandler, { passive: true })

        const mouseDownHandler = () => {
            gsap.to(dot, { scale: 0.7, duration: 0.3 })
            gsap.to(wrapper, { scale: 0.9, duration: 0.2 })
        }
        window.addEventListener("mousedown", mouseDownHandler)

        const mouseUpHandler = () => {
            gsap.to(dot, { scale: 1, duration: 0.3 })
            gsap.to(wrapper, { scale: 1, duration: 0.2 })
        }
        window.addEventListener("mouseup", mouseUpHandler)
        window.addEventListener("dragend", mouseUpHandler)

        const enterHandler = (e: MouseEvent) => {
            const directTarget = e.target as Element
            const allTargets: Element[] = []
            let current: Element | null = directTarget

            while (current && current !== document.body) {
                const matchesTarget = current.matches(targetSelector)
                const matchesInput = inputSelector
                    ? current.matches(inputSelector)
                    : false
                if (matchesTarget || matchesInput) allTargets.push(current)
                current = current.parentElement
            }

            if (allTargets.length === 0) {
                if (activeTarget) doLeave()
                return
            }

            const target = allTargets[0]
            if (!state.corners) return
            if (activeTarget === target) return

            const wasActive = !!activeTarget
            activeTarget = target
            activeLockEl = target.querySelector(lockSelector)

            if (resumeTimeout) {
                clearTimeout(resumeTimeout)
                resumeTimeout = null
            }

            // Capture exact current states to interpolate from (avoids snapping)
            state.startX = gsap.getProperty(wrapper, "x") as number
            state.startY = gsap.getProperty(wrapper, "y") as number
            state.cornerStarts = state.corners.map((c) => ({
                x: gsap.getProperty(c, "x") as number,
                y: gsap.getProperty(c, "y") as number
            }))

            if (!wasActive) {
                gsap.killTweensOf(wrapper, "rotation")
                state.resumeTween?.kill()
                state.spinTl?.pause()
                gsap.set(wrapper, { rotation: 0 })
                gsap.to(state.corners, { duration: 0.15, ease: "power2.out" })
            }

            state.isActive = true
            state.posStrength = 0
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
            containingBlockRef.current = getContainingBlock(root)
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
            document.documentElement.removeEventListener(
                "mouseleave",
                documentLeaveHandler
            )
            document.documentElement.removeEventListener(
                "mouseenter",
                documentEnterHandler
            )
            document.removeEventListener("visibilitychange", visibilityHandler)
            window.removeEventListener("blur", blurHandler)
            state.spinTl?.kill()
            state.resumeTween?.kill()
            document.body.style.cursor = originalCursor
            state.isActive = false
            styleEl?.remove()
        }
    }, [
        targetSelector,
        lockSelector,
        ignoreSelector,
        inputSelector,
        spinDuration,
        hideDefaultCursor,
        cursorColor,
        isTouchDevice
    ])

    return (
        <div
            ref={rootRef}
            aria-hidden={true}
            role="presentation"
            // Container gốc chỉ đứng im, không cần kích thước
            className={cn(
                "pointer-events-none invisible fixed left-0 top-0 z-infinite opacity-0",
                className
            )}
            {...props}
        >
            {/* Chấm bi đi theo trỏ chuột tuyệt đối */}
            <div
                ref={dotRef}
                className={cn(
                    "absolute left-0 top-0 z-1 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white will-change-transform"
                )}
            />
            {/* Wrapper quản lý 4 corners */}
            <div
                ref={wrapperRef}
                className="absolute left-0 top-0 will-change-transform"
            >
                <div
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-b-0 border-r-0 will-change-transform"
                    style={{ borderColor: cursorColor }}
                />
                <div
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-b-0 border-l-0 will-change-transform"
                    style={{ borderColor: cursorColor }}
                />
                <div
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-l-0 border-t-0 will-change-transform"
                    style={{ borderColor: cursorColor }}
                />
                <div
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-r-0 border-t-0 will-change-transform"
                    style={{ borderColor: cursorColor }}
                />
            </div>
        </div>
    )
}

export type { CursorSelector, TargetCursorProps }
export { TargetCursor }
