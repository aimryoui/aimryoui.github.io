"use client"

import { useSyncExternalStore } from "react"

import { Divider } from "@/components/layout/divider"
import { NoAIOverlay, NoAIPlaceholder } from "@/portfolio/_sections/no-ai"

// useSyncExternalStore requires a subscribe function; since CSS feature support
// never changes at runtime, we return a no-op unsubscribe.
const subscribe = (_: () => void) => () => {}
const getSnapshot = () => "anchorName" in document.documentElement.style
const getServerSnapshot = () => false

function AnchorSections() {
    const supported = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    if (!supported) return null

    return <NoAIOverlay />
}

function AnchorPlaceholder() {
    const supported = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    if (!supported) return null

    return (
        <>
            <NoAIPlaceholder />
            <Divider className="lg:hidden" />
        </>
    )
}

export { AnchorPlaceholder, AnchorSections }
