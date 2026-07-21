"use client"

import { useState } from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

type BrowserEngine = "blink" | "webkit" | "gecko" | "unknown"

interface BrowserEngineInfo {
    engine: BrowserEngine
    isWebkit: boolean
    isGecko: boolean
    isBlink: boolean
    isDesktopApp: boolean
}

interface DesktopWindow extends Window {
    process?: {
        versions?: {
            electron?: string
        }
    }
    __TAURI__?: unknown
}

let cachedEngine: BrowserEngine | null = null
let cachedIsDesktop: boolean | null = null

function detectBrowserEngine(): BrowserEngine {
    if (typeof window === "undefined") return "unknown"
    if (cachedEngine) return cachedEngine

    if (
        CSS.supports("-apple-pay-button-style", "black") ||
        CSS.supports("-webkit-touch-callout", "none")
    ) {
        cachedEngine = "webkit"
    } else if (CSS.supports("-moz-context-properties", "fill")) {
        cachedEngine = "gecko"
    } else if (
        CSS.supports("anchor-name", "--test") ||
        CSS.supports("-webkit-appearance", "none")
    ) {
        cachedEngine = "blink"
    } else {
        cachedEngine = "unknown"
    }

    return cachedEngine
}

function checkIsDesktopApp(): boolean {
    if (typeof window === "undefined") return false
    if (cachedIsDesktop !== null) return cachedIsDesktop

    const ua = navigator.userAgent.toLowerCase()
    const desktopWindow = window as unknown as DesktopWindow

    const isElectron =
        ua.includes("electron") ||
        Boolean(desktopWindow.process?.versions?.electron)

    const isTauri = "__TAURI__" in desktopWindow

    cachedIsDesktop = isElectron || isTauri
    return cachedIsDesktop
}

function useBrowserEngine(): BrowserEngineInfo {
    const [info, setInfo] = useState<BrowserEngineInfo>({
        engine: "unknown",
        isWebkit: false,
        isGecko: false,
        isBlink: false,
        isDesktopApp: false
    })

    useIsomorphicLayoutEffect(() => {
        const engine = detectBrowserEngine()
        const isDesktop = checkIsDesktopApp()

        setInfo({
            engine,
            isWebkit: engine === "webkit",
            isGecko: engine === "gecko",
            isBlink: engine === "blink",
            isDesktopApp: isDesktop
        })
    }, [])

    return info
}

export type { BrowserEngine, BrowserEngineInfo }
export { useBrowserEngine }
