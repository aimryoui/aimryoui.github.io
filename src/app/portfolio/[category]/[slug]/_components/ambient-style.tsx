import { TRIM_PROJECT_SLUG_REGEX } from "@/helpers/character-regexes"
import { generateColorRules } from "@/helpers/color-rules"
import { minifyCss } from "@/helpers/minify-css"
import colorManifestRaw from "@/lib/color-manifest.json"
import { type ColorManifest } from "@/scripts/process-colors"

import { type Project, projects } from "~/.velite"

const colorManifest = colorManifestRaw as ColorManifest

const ambientStylesMap = new Map<string, string>()

projects.forEach((project) => {
    const manifestKey = project.filePath.replace(TRIM_PROJECT_SLUG_REGEX, "")
    const projectColor = colorManifest[manifestKey]

    if (projectColor?.theme) {
        const hexRules = generateColorRules(projectColor.theme, "hex")
        const oklchRules = generateColorRules(projectColor.theme, "oklch")

        const cssString = minifyCss(/* css */ `
            :root:where([data-effects~='ambient-colors']) {
                ${hexRules}
            }
            @supports (color: oklab(0% 0 0%)) {
                :root:where([data-effects~='ambient-colors']) {
                    ${oklchRules}
                }
            }
        `)
        ambientStylesMap.set(project.id, cssString)
    }
})

function AmbientStyle({ project }: { project: Project }) {
    const ambientStyles = ambientStylesMap.get(project.id)

    if (ambientStyles)
        return <style dangerouslySetInnerHTML={{ __html: ambientStyles }} />

    return null
}

export { AmbientStyle }
