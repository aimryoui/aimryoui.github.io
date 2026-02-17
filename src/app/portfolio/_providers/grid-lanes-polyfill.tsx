"use client"

import { useEffect } from "react"

import { GridLanesPolyfill as polyfill } from "@/lib/grid-lanes-polyfill"

export function GridLanesPolyfill() {
    useEffect(() => {
        if (!polyfill.supportsGridLanes()) {
            const result = polyfill.init()
            console.log("🛣️ Grid Lanes Polyfill loaded")

            return () => {
                result.destroy?.()
            }
        }
    }, [])

    return null
}
