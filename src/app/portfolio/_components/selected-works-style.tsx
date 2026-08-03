import {
    TRIM_PROJECT_SLUG_REGEX,
    UPPERCASE_CHARACTERS_REGEX
} from "@/helpers/character-regexes"
import colorManifestRaw from "@/lib/color-manifest.json"
import { type ColorManifest } from "@/scripts/process-colors"

import { projects } from "~/.velite"

const colorManifest = colorManifestRaw as ColorManifest

function applyLightningFallback(colorValue: string) {
    if (colorValue.startsWith("light-dark(")) {
        const inner = colorValue.slice(11, -1)
        const [light, dark] = inner.split(",")

        return `var(--lightningcss-light, ${light.trim()}) var(--lightningcss-dark, ${dark.trim()})`
    }

    return colorValue
}

function SelectedWorksStyle() {
    const selectedWorksProjects = projects.filter(
        (project) => project.features?.selected[0]
    )

    let ambientStyles = ""

    selectedWorksProjects.forEach((project) => {
        const manifestKey = project.filePath.replace(
            TRIM_PROJECT_SLUG_REGEX,
            ""
        )
        const projectColor = colorManifest[manifestKey]

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

            ambientStyles += `#theme-${project.id}{${hexRules}}@supports (color: oklab(0% 0 0%)){#theme-${project.id}{${oklchRules}}}`
        }
    })

    if (ambientStyles)
        return <style dangerouslySetInnerHTML={{ __html: ambientStyles }} />

    return null
}

export { SelectedWorksStyle }
