import {
    type RefObject,
    useLayoutEffect,
    useMemo,
    useRef,
    useSyncExternalStore
} from "react"

import { BASE_FONT_SIZE } from "~/tailwind.config"

const UNIT_REGEX = /^([\d.]+)(px|rem|em|vw|vh)$/u

interface UseContainerQueryOptions {
    type?: "max" | "min"
}
const DEFAULT_OPTIONS: UseContainerQueryOptions = { type: "max" }

const getServerSnapshot = () => false

const subscriberMap = new WeakMap<Element, Set<() => void>>()
const sizeCache = new WeakMap<Element, number>()
let globalObserver: ResizeObserver | null = null

function getObserver() {
    if (typeof window === "undefined") return null
    globalObserver ??= new ResizeObserver((entries) => {
        for (const entry of entries) {
            const width = entry.contentRect.width
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
        observer.observe(element)
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

function calculatePixelThreshold(
    num: number,
    unit: string,
    element: HTMLElement
) {
    switch (unit) {
        case "rem":
            return (
                num *
                parseFloat(
                    getComputedStyle(document.documentElement).fontSize ||
                        BASE_FONT_SIZE.toString()
                )
            )
        case "px":
            return num
        case "em":
            return (
                num *
                parseFloat(
                    getComputedStyle(element).fontSize ||
                        BASE_FONT_SIZE.toString()
                )
            )
        case "vw":
            return num * (window.innerWidth / 100)
        case "vh":
            return num * (window.innerHeight / 100)
        default:
            return num
    }
}

export function useContainerQuery(
    ref: RefObject<HTMLElement | null>,
    query: string | number,
    options: UseContainerQueryOptions = DEFAULT_OPTIONS
): boolean {
    const parsed = useMemo(() => parseQuery(query), [query])
    const thresholdRef = useRef(0)

    useLayoutEffect(() => {
        if (ref.current) {
            thresholdRef.current = calculatePixelThreshold(
                parsed.num,
                parsed.unit,
                ref.current
            )
        }
    }, [parsed, ref])

    const subscribe = useMemo(() => {
        return (onStoreChange: () => void) => {
            if (!ref.current) return () => {}
            return subscribeElement(ref.current, onStoreChange)
        }
    }, [ref])

    const getSnapshot = () => {
        if (!ref.current) return false

        const currentWidth = sizeCache.get(ref.current)
        if (currentWidth === undefined) return false

        return options.type === "max"
            ? currentWidth <= thresholdRef.current
            : currentWidth >= thresholdRef.current
    }

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
