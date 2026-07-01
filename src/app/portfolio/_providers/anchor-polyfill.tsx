"use client"

import { useEffect } from "react"

function AnchorPolyfill() {
    useEffect(() => {
        const supportsAnchorPos = "anchorName" in document.documentElement.style
        // if (supportsAnchorPos)

        // Wait for fonts to finish loading before running the polyfill.
        // On Safari WebKit, the polyfill's DOM manipulation can interrupt
        // the font loading process, causing incorrect font rendering.
        // void document.fonts.ready.then(() => {
        //     void import("@oddbird/css-anchor-positioning").then(() => {
        //         console.log("⚓ CSS Anchor Positioning Polyfill loaded")
        //     })
        // })
    }, [])

    return null
}

export { AnchorPolyfill }
