"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import colorManifestRaw from "@/color-manifest.json"
import { type ColorManifest } from "@/scripts/process-colors"

const ALL_CHARACTERS_REGEX = /([A-Z])/gu
const PATH_REGEX = /^\/portfolio\/([^/]+)\/([^/]+)$/u

const colorManifest = colorManifestRaw as ColorManifest

const toCssVar = (key: string) =>
    `--color-${key.replace(ALL_CHARACTERS_REGEX, "-$1").toLowerCase()}`

function ColorUpdater() {
    const pathname = usePathname()

    useEffect(() => {
        if (!pathname) return

        const match = PATH_REGEX.exec(pathname)
        if (match) {
            const manifestKey = `${match[1]}/${match[2]}`
            const cacheEntry = colorManifest[manifestKey]
            if (cacheEntry?.theme) {
                Object.entries(cacheEntry.theme).forEach(([key, colorData]) => {
                    const cssVar = toCssVar(key)

                    document.documentElement.style.setProperty(
                        cssVar,
                        colorData.hex
                    )
                    document.documentElement.style.setProperty(
                        cssVar,
                        colorData.oklch
                    )
                })
                return
            }
        }

        const firstColorObj = Object.values(colorManifest)[0]
        if (firstColorObj?.theme) {
            Object.keys(firstColorObj.theme).forEach((key) => {
                document.documentElement.style.removeProperty(toCssVar(key))
            })
        }
    }, [pathname])

    return null
}

export { ColorUpdater }
