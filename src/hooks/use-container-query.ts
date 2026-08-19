import {
    type RefObject,
    useCallback,
    useMemo,
    useSyncExternalStore
} from "react"

import { BASE_FONT_SIZE } from "~/tailwind.config"

const UNIT_REGEX = /^([\d.]+)(px|rem|vw|vh)$/u

interface UseContainerQueryOptions {
    type?: "max" | "min"
}
const DEFAULT_OPTIONS: UseContainerQueryOptions = { type: "max" }

const getServerSnapshot = () => false

const subscriberMap = new WeakMap<Element, Set<() => void>>()
const sizeCache = new WeakMap<Element, number>()
let globalObserver: ResizeObserver | null = null

let rootFontSizeCache: number | null = null
let windowWidthCache: number | null = null
let windowHeightCache: number | null = null

if (typeof window !== "undefined") {
    window.addEventListener(
        "resize",
        () => {
            rootFontSizeCache = null
            windowWidthCache = null
            windowHeightCache = null
        },
        { passive: true }
    )
}

function getRootFontSize() {
    if (rootFontSizeCache !== null) return rootFontSizeCache

    rootFontSizeCache =
        parseFloat(getComputedStyle(document.documentElement).fontSize)
        || BASE_FONT_SIZE
    return rootFontSizeCache
}

function getObserver() {
    if (typeof window === "undefined") return null
    globalObserver ??= new ResizeObserver((entries) => {
        for (const entry of entries) {
            let width = entry.contentRect.width
            if ("borderBoxSize" in entry && entry.borderBoxSize.length > 0) {
                width = entry.borderBoxSize[0].inlineSize
            }
            sizeCache.set(entry.target, width)

            const callbacks = subscriberMap.get(entry.target)
            if (callbacks) {
                callbacks.forEach((cb) => {
                    cb()
                })
            }
        }
    })
    return globalObserver
}

function subscribeElement(element: Element, callback: () => void) {
    const observer = getObserver()
    if (!observer) return () => {}

    if (!subscriberMap.has(element)) {
        subscriberMap.set(element, new Set())

        observer.observe(element, { box: "border-box" })
    }
    subscriberMap.get(element)?.add(callback)

    return () => {
        const callbacks = subscriberMap.get(element)
        if (callbacks) {
            callbacks.delete(callback)
            if (callbacks.size === 0) {
                subscriberMap.delete(element)
                observer.unobserve(element)
            }
        }
    }
}

function parseQuery(query: string | number) {
    if (typeof query === "number") return { num: query, unit: "px" }

    const match = UNIT_REGEX.exec(query)
    return match
        ? { num: parseFloat(match[1]), unit: match[2] }
        : { num: parseFloat(query) || 0, unit: "px" }
}

function calculatePixelThreshold(num: number, unit: string) {
    switch (unit) {
        case "rem":
            return num * getRootFontSize()
        case "px":
            return num
        case "vw":
            windowWidthCache ??= window.innerWidth
            return num * (windowWidthCache / 100)
        case "vh":
            windowHeightCache ??= window.innerHeight
            return num * (windowHeightCache / 100)
        default:
            return num
    }
}

function useContainerQuery(
    ref: RefObject<HTMLElement | null>,
    query: string | number,
    options: UseContainerQueryOptions = DEFAULT_OPTIONS
): boolean {
    const parsed = useMemo(() => parseQuery(query), [query])

    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            if (!ref.current) return () => {}
            return subscribeElement(ref.current, onStoreChange)
        },
        [ref]
    )

    const getSnapshot = useCallback(() => {
        if (!ref.current) return false

        const currentWidth = sizeCache.get(ref.current)

        if (currentWidth === undefined) return false

        const threshold = calculatePixelThreshold(parsed.num, parsed.unit)

        return options.type === "max"
            ? currentWidth <= threshold
            : currentWidth >= threshold
    }, [ref, parsed, options.type])

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useContainerQuery }
