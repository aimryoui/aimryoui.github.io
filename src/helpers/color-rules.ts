import { UPPERCASE_CHARACTERS_REGEX } from "@/helpers/character-regexes"

function applyLightningFallback(colorValue: string) {
    if (colorValue.startsWith("light-dark(")) {
        const inner = colorValue.slice(11, -1)
        const [light, dark] = inner.split(",")

        return `var(--lightningcss-light, ${light.trim()}) var(--lightningcss-dark, ${dark.trim()})`
    }

    return colorValue
}

function generateColorRules(
    theme: Record<string, { hex: string; oklch: string }>,
    format: "hex" | "oklch"
) {
    return Object.entries(theme)
        .map(([key, colorData]) => {
            const cssVar = `--color-${key.replace(UPPERCASE_CHARACTERS_REGEX, "-$1").toLowerCase()}`
            return `${cssVar}:${applyLightningFallback(colorData[format])};`
        })
        .join("")
}

export { applyLightningFallback, generateColorRules }
