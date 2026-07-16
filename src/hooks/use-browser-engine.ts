"use client"

import { useState } from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"

type BrowserEngine = "webkit" | "gecko" | "blink" | "unknown"

interface BrowserEngineInfo {
    engine: BrowserEngine
    isWebkit: boolean
    isGecko: boolean
    isBlink: boolean
}

let cachedEngine: BrowserEngine | null = null

const detectBrowserEngine = (): BrowserEngine => {
    if (typeof window === "undefined") return "unknown"

    if (cachedEngine) return cachedEngine

    if (
        CSS.supports("-apple-pay-button-style", "black") ||
        CSS.supports("(-apple-pay-button-style: black)")
    ) {
        cachedEngine = "webkit"
    } else if (
        CSS.supports("-moz-appearance", "none") ||
        CSS.supports("(-moz-appearance: none)")
    ) {
        cachedEngine = "gecko"
    } else if (
        CSS.supports("-webkit-appearance", "none") ||
        CSS.supports("(-webkit-appearance: none)")
    ) {
        cachedEngine = "blink"
    } else {
        cachedEngine = "unknown"
    }

    return cachedEngine
}

function useBrowserEngine(): BrowserEngineInfo {
    const [engine, setEngine] = useState<BrowserEngine>("unknown")

    useIsomorphicLayoutEffect(() => {
        setEngine(detectBrowserEngine())
    }, [])

    return {
        engine,
        isWebkit: engine === "webkit",
        isGecko: engine === "gecko",
        isBlink: engine === "blink"
    }
}

export type { BrowserEngine, BrowserEngineInfo }
export { useBrowserEngine }
