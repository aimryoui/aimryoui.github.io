"use client"

import { useState } from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

export type OperatingSystem =
    | "windows"
    | "macOS"
    | "iOS/iPadOS"
    | "android"
    | "linux"
    | "unknown"

interface OperatingSystemInfo {
    os: OperatingSystem
    isWindows: boolean
    isMacOS: boolean
    isIOS: boolean
    isAndroid: boolean
    isLinux: boolean
}

interface NavigatorUAD extends Navigator {
    userAgentData?: {
        platform: string
        mobile: boolean
    }
}

let cachedOS: OperatingSystem | null = null

function detectOperatingSystem(): OperatingSystem {
    if (typeof window === "undefined") return "unknown"
    if (cachedOS) return cachedOS

    if (CSS.supports("-webkit-touch-callout", "none")) {
        cachedOS = "iOS/iPadOS"
        return cachedOS
    }

    if (CSS.supports("-apple-pay-button-style", "black")) {
        cachedOS = "macOS"
        return cachedOS
    }

    const nav = navigator as NavigatorUAD

    if (nav.userAgentData?.platform) {
        const platform = nav.userAgentData.platform.toLowerCase()

        if (platform === "windows") cachedOS = "windows"
        else if (platform === "macos") cachedOS = "macOS"
        else if (platform === "android") cachedOS = "android"
        else if (platform === "linux" || platform === "chrome os")
            cachedOS = "linux"

        if (cachedOS) return cachedOS
    }

    const platform = (navigator.platform || "").toLowerCase()
    const ua = (navigator.userAgent || "").toLowerCase()

    if (platform.includes("win")) {
        cachedOS = "windows"
    } else if (platform.includes("mac")) {
        cachedOS = "macOS"
    } else if (platform.includes("linux")) {
        cachedOS = ua.includes("android") ? "android" : "linux"
    } else if (ua.includes("android")) {
        cachedOS = "android"
    } else {
        cachedOS = "unknown"
    }

    return cachedOS
}

function useOperatingSystem(): OperatingSystemInfo {
    const [os, setOs] = useState<OperatingSystem>("unknown")

    useIsomorphicLayoutEffect(() => {
        setOs(detectOperatingSystem())
    }, [])

    return {
        os,
        isWindows: os === "windows",
        isMacOS: os === "macOS",
        isIOS: os === "iOS/iPadOS",
        isAndroid: os === "android",
        isLinux: os === "linux"
    }
}

export { useOperatingSystem }
