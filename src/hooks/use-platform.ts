"use client"

import { useEffect, useState } from "react"

export function usePlatform() {
    const [platform, setPlatform] = useState<string | null>(null)

    useEffect(() => {
        const currentPlatform =
            document.documentElement.getAttribute("data-platform")
        setPlatform(currentPlatform ?? "mac")
    }, [])

    return platform
}
