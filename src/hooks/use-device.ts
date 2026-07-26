"use client"

import { useState } from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

interface DeviceInfo {
    isTouchDevice: boolean
}

let currentModality: "touch" | "mouse" | null = null
const listeners = new Set<(isTouch: boolean) => void>()
let isGlobalSetup = false

function getInitialGuess(): boolean {
    if (typeof window === "undefined") return false
    return !window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function setupGlobalModalityListeners() {
    if (typeof window === "undefined" || isGlobalSetup) return
    isGlobalSetup = true

    const updateModality = (isTouch: boolean) => {
        const newModality = isTouch ? "touch" : "mouse"
        if (currentModality !== newModality) {
            currentModality = newModality
            listeners.forEach((setReactState) => {
                setReactState(isTouch)
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

function useDevice(): DeviceInfo {
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(
        currentModality === null
            ? getInitialGuess()
            : currentModality === "touch"
    )

    useIsomorphicLayoutEffect(() => {
        setupGlobalModalityListeners()

        listeners.add(setIsTouchDevice)

        if (currentModality !== null) {
            setIsTouchDevice(currentModality === "touch")
        }

        return () => {
            listeners.delete(setIsTouchDevice)
        }
    }, [])

    return {
        isTouchDevice
    }
}

export type { DeviceInfo }
export { useDevice }
