"use client"

import { useEffect, useRef } from "react"

import { gsap } from "gsap"

import { minifyCss } from "@/helpers/minify-css"
import { pxToRem } from "@/helpers/px-to-rem"
import { useDevice } from "@/hooks/use-device"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"
import { useEffectsStore } from "@/stores/effects-store"

import { BASE_FONT_SIZE } from "~/tailwind.config"

type CursorSelector =
    | "target"
    | "lock"
    | "input"
    | "ignore"
    | "corner"
    | false
    | null

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

const BORDER_WIDTH = pxToRem(3)
const EXPANDED_CORNER_SIZE = pxToRem(12)
const REST_CORNER_SIZE = pxToRem(6)
const REST_OFFSET = pxToRem(9)

const REST_POSITIONS = [
    { x: -REST_OFFSET, y: -REST_OFFSET },
    { x: REST_OFFSET - REST_CORNER_SIZE, y: -REST_OFFSET },
    { x: REST_OFFSET - REST_CORNER_SIZE, y: REST_OFFSET - REST_CORNER_SIZE },
    { x: -REST_OFFSET, y: REST_OFFSET - REST_CORNER_SIZE }
] as const

const globalMouse = { x: 0, y: 0, moved: false }
if (typeof window !== "undefined") {
    window.addEventListener(
        "pointerdown",
        (e) => {
            if (e.pointerType === "mouse") {
                globalMouse.x = e.clientX
                globalMouse.y = e.clientY
                globalMouse.moved = true
            }
        },
        { passive: true, capture: true }
    )
}

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
    const reduceMotion = useReducedMotion()
    const isEffectEnabled = useEffectsStore((state) =>
        state.hasEffect("target-cursor")
    )

    const rootRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const containingBlockRef = useRef<HTMLElement | null>(null)

    const cachedOffset = useRef({ x: 0, y: 0 })

    const stateRef = useRef({
        corners: null as HTMLDivElement[] | null,
        spinTl: null as gsap.core.Timeline | null,
        resumeTween: null as gsap.core.Tween | null,
        isActive: false,

        mouseX: 0,
        mouseY: 0,

        startX: 0,
        startY: 0,
        cornerStarts: null as { x: number; y: number }[] | null,

        posStrength: 0,
        sizeStrength: 0,

        clickScale: 1,

        tx: new Float32Array(4),
        ty: new Float32Array(4)
    })

    useEffect(() => {
        if (
            reduceMotion ||
            isTouchDevice ||
            !isEffectEnabled ||
            !rootRef.current ||
            !wrapperRef.current ||
            !dotRef.current
        )
            return

        const root = rootRef.current
        const wrapper = wrapperRef.current
        const dot = dotRef.current
        const state = stateRef.current

        gsap.ticker.fps(144)

        gsap.set(root, { autoAlpha: 0 })

        const originalCursor = document.body.style.cursor
        let styleEl: HTMLStyleElement | null = null
        if (hideDefaultCursor) {
            styleEl = document.createElement("style")
            styleEl.textContent = minifyCss(/* css */ `
                body,
                body *:not(
                    ${ignoreSelector}, ${ignoreSelector} *,
                    ${inputSelector}, ${inputSelector} *,
                    .pswp, .pswp *,
                    input, input *
                ) {
                    cursor: none;
                }
            `)
            document.head.appendChild(styleEl)
        }

        state.corners = Array.from(
            wrapper.querySelectorAll<HTMLDivElement>("[data-cursor='corner']")
        )

        state.corners.forEach((corner, i) => {
            gsap.set(corner, {
                x: `${REST_POSITIONS[i].x}rem`,
                y: `${REST_POSITIONS[i].y}rem`,
                width: `${REST_CORNER_SIZE}rem`,
                height: `${REST_CORNER_SIZE}rem`
            })
        })

        const updateOffsetCache = () => {
            containingBlockRef.current = getContainingBlock(root)
            cachedOffset.current = getContainingBlockOffset(
                containingBlockRef.current
            )
        }
        updateOffsetCache()

        let activeTarget: Element | null = null
        let activeLockEl: Element | null = null
        let resumeTimeout: ReturnType<typeof setTimeout> | null = null

        let hasMoved = globalMouse.moved
        if (hasMoved) {
            state.mouseX = globalMouse.x - cachedOffset.current.x
            state.mouseY = globalMouse.y - cachedOffset.current.y
        }
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

            const currentWrapperX = gsap.getProperty(wrapper, "x") as number
            const currentWrapperY = gsap.getProperty(wrapper, "y") as number

            const dx = currentWrapperX - state.mouseX
            const dy = currentWrapperY - state.mouseY

            gsap.set(wrapper, { x: state.mouseX, y: state.mouseY })

            const corners = state.corners
            if (corners) {
                gsap.killTweensOf(corners, "x,y,width,height")
                const tl = gsap.timeline()

                const rootRem =
                    parseFloat(
                        getComputedStyle(document.documentElement).fontSize
                    ) || BASE_FONT_SIZE
                const dxRem = dx / rootRem
                const dyRem = dy / rootRem

                corners.forEach((corner, index) => {
                    const currentX = gsap.getProperty(corner, "x") as number
                    const currentY = gsap.getProperty(corner, "y") as number

                    gsap.set(corner, {
                        x: `${currentX + dxRem}rem`,
                        y: `${currentY + dyRem}rem`
                    })

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
        if (state.resumeTween) {
            state.resumeTween.kill()
            state.resumeTween = null
        }
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
                const offsetX = cachedOffset.current.x
                const offsetY = cachedOffset.current.y

                const cx = rect.left + rect.width / 2 - offsetX
                const cy = rect.top + rect.height / 2 - offsetY

                const rootRem =
                    parseFloat(
                        getComputedStyle(document.documentElement).fontSize
                    ) || BASE_FONT_SIZE
                const wRem = rect.width / 2 / rootRem
                const hRem = rect.height / 2 / rootRem

                state.tx[0] = -wRem - BORDER_WIDTH
                state.ty[0] = -hRem - BORDER_WIDTH
                state.tx[1] = wRem + BORDER_WIDTH - EXPANDED_CORNER_SIZE
                state.ty[1] = -hRem - BORDER_WIDTH
                state.tx[2] = wRem + BORDER_WIDTH - EXPANDED_CORNER_SIZE
                state.ty[2] = hRem + BORDER_WIDTH - EXPANDED_CORNER_SIZE
                state.tx[3] = -wRem - BORDER_WIDTH
                state.ty[3] = hRem + BORDER_WIDTH - EXPANDED_CORNER_SIZE

                const {
                    posStrength,
                    sizeStrength,
                    clickScale,
                    startX,
                    startY,
                    cornerStarts,
                    corners,
                    tx,
                    ty
                } = state

                if (!corners || !cornerStarts) return

                const wrapperX = startX + (cx - startX) * posStrength
                const wrapperY = startY + (cy - startY) * posStrength

                gsap.set(wrapper, {
                    x: wrapperX,
                    y: wrapperY
                })

                const mxRem = (state.mouseX - wrapperX) / rootRem
                const myRem = (state.mouseY - wrapperY) / rootRem

                const currentCornerSize =
                    REST_CORNER_SIZE +
                    (EXPANDED_CORNER_SIZE - REST_CORNER_SIZE) * sizeStrength

                for (let i = 0; i < 4; i++) {
                    const sx = cornerStarts[i].x
                    const sy = cornerStarts[i].y

                    const baseX = sx + (tx[i] - sx) * posStrength
                    const baseY = sy + (ty[i] - sy) * posStrength

                    const finalX = mxRem + (baseX - mxRem) * clickScale
                    const finalY = myRem + (baseY - myRem) * clickScale
                    const finalSize = currentCornerSize * clickScale

                    gsap.set(corners[i], {
                        x: `${finalX}rem`,
                        y: `${finalY}rem`,
                        width: `${finalSize}rem`,
                        height: `${finalSize}rem`
                    })
                }
            }
        }

        const moveHandler = (e: MouseEvent) => {
            const offsetX = cachedOffset.current.x
            const offsetY = cachedOffset.current.y
            const mx = e.clientX - offsetX
            const my = e.clientY - offsetY

            state.mouseX = mx
            state.mouseY = my

            gsap.set(dot, { x: mx, y: my })

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
            cachedOffset.current = getContainingBlockOffset(
                containingBlockRef.current
            )

            if (activeTarget) {
                doLeave()
            }
        }
        window.addEventListener("scroll", scrollHandler, { passive: true })

        const mouseDownHandler = () => {
            gsap.to(dot, { scale: 0.7, duration: 0.3 })
            if (state.isActive) {
                gsap.to(state, {
                    clickScale: 0.9,
                    duration: 0.2,
                    overwrite: "auto"
                })
            } else {
                gsap.to(wrapper, {
                    scale: 0.9,
                    duration: 0.2,
                    overwrite: "auto"
                })
            }
        }
        const mouseUpHandler = () => {
            gsap.to(dot, { scale: 1, duration: 0.3 })
            gsap.to(state, { clickScale: 1, duration: 0.2, overwrite: "auto" })
            gsap.to(wrapper, { scale: 1, duration: 0.2, overwrite: "auto" })
        }

        window.addEventListener("mousedown", mouseDownHandler, {
            capture: true
        })
        window.addEventListener("mouseup", mouseUpHandler, { capture: true })
        window.addEventListener("dragend", mouseUpHandler, { capture: true })

        const processTarget = (directTarget: Element) => {
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
            const corners = state.corners

            if (!corners) return
            if (activeTarget === target) return

            const wasActive = !!activeTarget
            activeTarget = target
            activeLockEl = target.querySelector(lockSelector)

            if (resumeTimeout) {
                clearTimeout(resumeTimeout)
                resumeTimeout = null
            }

            state.startX = gsap.getProperty(wrapper, "x") as number
            state.startY = gsap.getProperty(wrapper, "y") as number

            state.cornerStarts = corners.map((c) => ({
                x: gsap.getProperty(c, "x") as number,
                y: gsap.getProperty(c, "y") as number
            }))

            if (!wasActive) {
                gsap.killTweensOf(wrapper, "rotation,scale")
                state.resumeTween?.kill()
                state.spinTl?.pause()
                gsap.set(wrapper, { rotation: 0, scale: 1 })
                gsap.to(corners, { duration: 0.15, ease: "power2.out" })
            }

            state.isActive = true
            state.posStrength = 0
            state.clickScale = 1
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

        const enterHandler = (e: MouseEvent) => {
            processTarget(e.target as Element)
        }

        window.addEventListener("mouseover", enterHandler as EventListener)

        const resizeHandler = () => {
            updateOffsetCache()
        }
        window.addEventListener("resize", resizeHandler)

        if (hasMoved) {
            gsap.set(wrapper, { x: state.mouseX, y: state.mouseY })
            gsap.set(dot, { x: state.mouseX, y: state.mouseY })
            updateVisibility()

            const el = document.elementFromPoint(globalMouse.x, globalMouse.y)
            if (el) {
                const isIgnored = ignoreSelector
                    ? el.closest(ignoreSelector) !== null
                    : false
                const isInput = inputSelector
                    ? el.closest(inputSelector) !== null
                    : false

                let visibilityChanged = false
                if (isIgnored) {
                    isHiddenByIgnore = true
                    visibilityChanged = true
                }
                if (isInput) {
                    isHiddenByInput = true
                    visibilityChanged = true
                }
                if (visibilityChanged) updateVisibility()

                processTarget(el)
            }
        }

        return () => {
            gsap.ticker.fps(0)
            gsap.ticker.remove(tickerFn)
            window.removeEventListener("mousemove", moveHandler)
            window.removeEventListener(
                "mouseover",
                enterHandler as EventListener
            )
            window.removeEventListener("scroll", scrollHandler)
            window.removeEventListener("resize", resizeHandler)

            window.removeEventListener("mousedown", mouseDownHandler, {
                capture: true
            })
            window.removeEventListener("mouseup", mouseUpHandler, {
                capture: true
            })
            window.removeEventListener("dragend", mouseUpHandler, {
                capture: true
            })

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
        isTouchDevice,
        reduceMotion,
        isEffectEnabled
    ])

    if (reduceMotion || isTouchDevice || !isEffectEnabled) return null

    return (
        <div
            data-slot="target-cursor"
            ref={rootRef}
            aria-hidden={true}
            role="presentation"
            className={cn(
                "pointer-events-none invisible fixed left-0 top-0 z-infinite opacity-0",
                className
            )}
            {...props}
        >
            <div
                data-slot="target-cursor-dot"
                ref={dotRef}
                className={cn(
                    "absolute left-0 top-0 z-1 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white will-change-transform"
                )}
            />
            <div
                data-slot="target-cursor-corners"
                ref={wrapperRef}
                className="absolute left-0 top-0 will-change-transform"
            >
                <div
                    data-slot="target-cursor-corner"
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-b-0 border-r-0 will-change-transform"
                    style={{
                        borderColor: cursorColor,
                        width: `${REST_CORNER_SIZE}rem`,
                        height: `${REST_CORNER_SIZE}rem`,
                        transform: `translate(${REST_POSITIONS[0].x}rem, ${REST_POSITIONS[0].y}rem)`
                    }}
                />
                <div
                    data-slot="target-cursor-corner"
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-b-0 border-l-0 will-change-transform"
                    style={{
                        borderColor: cursorColor,
                        width: `${REST_CORNER_SIZE}rem`,
                        height: `${REST_CORNER_SIZE}rem`,
                        transform: `translate(${REST_POSITIONS[1].x}rem, ${REST_POSITIONS[1].y}rem)`
                    }}
                />
                <div
                    data-slot="target-cursor-corner"
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-l-0 border-t-0 will-change-transform"
                    style={{
                        borderColor: cursorColor,
                        width: `${REST_CORNER_SIZE}rem`,
                        height: `${REST_CORNER_SIZE}rem`,
                        transform: `translate(${REST_POSITIONS[2].x}rem, ${REST_POSITIONS[2].y}rem)`
                    }}
                />
                <div
                    data-slot="target-cursor-corner"
                    data-cursor="corner"
                    className="absolute left-0 top-0 border-3 border-r-0 border-t-0 will-change-transform"
                    style={{
                        borderColor: cursorColor,
                        width: `${REST_CORNER_SIZE}rem`,
                        height: `${REST_CORNER_SIZE}rem`,
                        transform: `translate(${REST_POSITIONS[3].x}rem, ${REST_POSITIONS[3].y}rem)`
                    }}
                />
            </div>
        </div>
    )
}

export type { CursorSelector, TargetCursorProps }
export { TargetCursor }
