"use client"

import { useState } from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

interface DeviceInfo {
    isTouchDevice: boolean
}

let cachedIsTouchDevice: boolean | null = null

function detectIsTouchDevice(): boolean {
    if (typeof window === "undefined") return false
    if (cachedIsTouchDevice !== null) return cachedIsTouchDevice

    cachedIsTouchDevice = !window.matchMedia("(hover: hover) and (pointer: fine)")
        .matches

    return cachedIsTouchDevice
}

function useDevice(): DeviceInfo {
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false)

    useIsomorphicLayoutEffect(() => {
        setIsTouchDevice(detectIsTouchDevice())
    }, [])

    return {
        isTouchDevice
    }
}

export type { DeviceInfo }
export { useDevice }
