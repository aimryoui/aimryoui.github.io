import { TRIM_PROJECT_SLUG_REGEX } from "@/helpers/character-regexes"
import { generateColorRules } from "@/helpers/color-rules"
import { minifyCss } from "@/helpers/minify-css"
import colorManifestRaw from "@/lib/color-manifest.json"
import { type ColorManifest } from "@/scripts/process-colors"

import { projects } from "~/.velite"

const colorManifest = colorManifestRaw as ColorManifest

const selectedWorksProjects = projects.filter(
    (project) => project.features?.selected[0]
)

let ambientStyles = ""

selectedWorksProjects.forEach((project) => {
    const manifestKey = project.filePath.replace(TRIM_PROJECT_SLUG_REGEX, "")
    const projectColor = colorManifest[manifestKey]

    if (projectColor?.theme && project.id) {
        const hexRules = generateColorRules(projectColor.theme, "hex")
        const oklchRules = generateColorRules(projectColor.theme, "oklch")

        ambientStyles += minifyCss(/* css */ `
            :root:where([data-effects~='ambient-colors']) #theme-${project.id}:hover,
            :root:where([data-effects~='ambient-colors']) #theme-${project.id}:active {
                ${hexRules}
            }
            @supports (color: oklab(0% 0 0%)) {
                :root:where([data-effects~='ambient-colors']) #theme-${project.id}:hover,
                :root:where([data-effects~='ambient-colors']) #theme-${project.id}:active {
                    ${oklchRules}
                }
            }
        `)
    }
})

function SelectedWorksStyle() {
    if (ambientStyles)
        return <style dangerouslySetInnerHTML={{ __html: ambientStyles }} />

    return null
}

export { SelectedWorksStyle }
