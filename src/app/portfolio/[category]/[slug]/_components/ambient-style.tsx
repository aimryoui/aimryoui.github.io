import {
    TRIM_PROJECT_SLUG_REGEX,
    UPPERCASE_CHARACTERS_REGEX
} from "@/helpers/character-regexes"
import colorManifestRaw from "@/lib/color-manifest.json"
import { type ColorManifest } from "@/scripts/process-colors"

import { type Project } from "~/.velite"

const colorManifest = colorManifestRaw as ColorManifest

function applyLightningFallback(colorValue: string) {
    if (colorValue.startsWith("light-dark(")) {
        const inner = colorValue.slice(11, -1)
        const [light, dark] = inner.split(",")

        return `var(--lightningcss-light, ${light.trim()}) var(--lightningcss-dark, ${dark.trim()})`
    }

    return colorValue
}

function AmbientStyle({ project }: { project: Project }) {
    const manifestKey = project.filePath.replace(TRIM_PROJECT_SLUG_REGEX, "")
    const projectColor = colorManifest[manifestKey]

    let ambientStyles = ""
    if (projectColor?.theme) {
        const hexRules = Object.entries(projectColor.theme)
            .map(([key, colorData]) => {
                const cssVar = `--color-${key.replace(UPPERCASE_CHARACTERS_REGEX, "-$1").toLowerCase()}`
                return `${cssVar}:${applyLightningFallback(colorData.hex)};`
            })
            .join("")

        const oklchRules = Object.entries(projectColor.theme)
            .map(([key, colorData]) => {
                const cssVar = `--color-${key.replace(UPPERCASE_CHARACTERS_REGEX, "-$1").toLowerCase()}`
                return `${cssVar}:${applyLightningFallback(colorData.oklch)};`
            })
            .join("")

        ambientStyles = `:root:where([data-effects~='ambient-colors']){${hexRules}}@supports (color: oklab(0% 0 0%)){:root:where([data-effects~='ambient-colors']){${oklchRules}}}`
    }

    if (ambientStyles)
        return <style dangerouslySetInnerHTML={{ __html: ambientStyles }} />

    return null
}

export { AmbientStyle }
