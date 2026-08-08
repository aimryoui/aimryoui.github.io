const AVAILABLE_EFFECTS = ["target-cursor", "ambient-colors"] as const
type Effect = (typeof AVAILABLE_EFFECTS)[number]

const DISABLED_BY_DEFAULT: Effect[] = []

const DEFAULT_EFFECTS: Effect[] = AVAILABLE_EFFECTS.filter(
    (effect) => !DISABLED_BY_DEFAULT.includes(effect)
)

const EFFECT_LABELS: Record<Effect, string> = {
    "target-cursor": "Target cursor",
    "ambient-colors": "Ambient colors"
}

const EFFECT_DESCRIPTIONS: Record<Effect, string> = {
    "target-cursor":
        "Use custom cursor that snappy-snaps to clickable elements",
    "ambient-colors":
        "Use project vibrant-based colors instead of default colors"
}

export type { Effect }
export {
    AVAILABLE_EFFECTS,
    DEFAULT_EFFECTS,
    EFFECT_DESCRIPTIONS,
    EFFECT_LABELS
}
