"use client"

import { useState } from "react"

import { Divider } from "@/components/layout/divider"
import { NoAIOverlay, NoAIPlaceholder } from "@/portfolio/_sections/no-ai"

function AnchorSections() {
    const [supported] = useState(
        () => "anchorName" in document.documentElement.style
    )

    if (!supported) return null

    return <NoAIOverlay />
}

function AnchorPlaceholder() {
    const [supported] = useState(
        () => "anchorName" in document.documentElement.style
    )

    if (!supported) return null

    return (
        <>
            <NoAIPlaceholder />
            <Divider className="lg:hidden" />
        </>
    )
}

export { AnchorPlaceholder, AnchorSections }
