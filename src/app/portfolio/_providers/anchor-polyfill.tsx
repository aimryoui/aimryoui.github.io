"use client"

import { useEffect } from "react"

function AnchorPolyfill() {
    useEffect(() => {
        const supportsAnchorPos = "anchorName" in document.documentElement.style

        if (!supportsAnchorPos) {
            void import("@oddbird/css-anchor-positioning").then(() => {
                console.log("⚓ CSS Anchor Positioning Polyfill loaded")
            })
        }
    }, [])

    return null
}

export { AnchorPolyfill }
