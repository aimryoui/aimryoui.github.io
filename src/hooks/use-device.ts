import { useSyncExternalStore } from "react"

interface DeviceInfo {
    isTouchDevice: boolean
}

let currentModality: "touch" | "mouse" | null = null
const listeners = new Set<() => void>()
let isGlobalSetup = false
let cachedInitialGuess: boolean | null = null

function getInitialGuess(): boolean {
    if (typeof window === "undefined") return false

    const hasTouchPoints = navigator.maxTouchPoints > 0

    const hasCoarsePointer = window.matchMedia("(any-pointer: coarse)").matches

    const hasTouchStart = "ontouchstart" in window

    return hasTouchPoints || hasCoarsePointer || hasTouchStart
}

function setupGlobalModalityListeners() {
    if (typeof window === "undefined" || isGlobalSetup) return
    isGlobalSetup = true

    const updateModality = (isTouch: boolean) => {
        const newModality = isTouch ? "touch" : "mouse"
        if (currentModality !== newModality) {
            currentModality = newModality
            listeners.forEach((listener) => {
                listener()
            })
        }
    }

    window.addEventListener(
        "pointerdown",
        (e) => {
            updateModality(e.pointerType === "touch" || e.pointerType === "pen")
        },
        { capture: true, passive: true }
    )

    window.addEventListener(
        "pointermove",
        (e) => {
            updateModality(e.pointerType === "touch" || e.pointerType === "pen")
        },
        { capture: true, passive: true }
    )

    window.addEventListener(
        "touchstart",
        () => {
            updateModality(true)
        },
        { capture: true, passive: true }
    )
}

function subscribe(callback: () => void) {
    setupGlobalModalityListeners()
    listeners.add(callback)
    return () => {
        listeners.delete(callback)
    }
}

function getSnapshot() {
    if (currentModality !== null) {
        return currentModality === "touch"
    }
    cachedInitialGuess ??= getInitialGuess()
    return cachedInitialGuess
}

function getServerSnapshot() {
    return false
}

function useDevice(): DeviceInfo {
    const isTouchDevice = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )

    return {
        isTouchDevice
    }
}

export type { DeviceInfo }
export { useDevice }
