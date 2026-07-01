"use client"

import { useEffect } from "react"

function AnchorPolyfill() {
    useEffect(() => {
        const supportsAnchorPos = "anchorName" in document.documentElement.style
        if (supportsAnchorPos) return

        // Defer polyfill until after fonts & first paint.
        // Loading @oddbird/css-anchor-positioning synchronously with useEffect
        // causes a heavy reflow mid-paint on WebKit, which resets Safari's font
        // swap state and results in incorrect font rendering.
        const load = () => {
            void import("@oddbird/css-anchor-positioning").then(() => {
                console.log("⚓ CSS Anchor Positioning Polyfill loaded")
            })
        }

        if ("requestIdleCallback" in window) {
            requestIdleCallback(load, { timeout: 1000 })
        } else {
            setTimeout(load, 200)
        }
    }, [])

    return null
}

export { AnchorPolyfill }
