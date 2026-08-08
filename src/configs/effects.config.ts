const AVAILABLE_EFFECTS = ["target-cursor", "ambient-colors"] as const
type Effect = (typeof AVAILABLE_EFFECTS)[number]

const DISABLED_BY_DEFAULT: Effect[] = []

const DEFAULT_EFFECTS: Effect[] = AVAILABLE_EFFECTS.filter(
    (effect) => !DISABLED_BY_DEFAULT.includes(effect)
)

export { AVAILABLE_EFFECTS, DEFAULT_EFFECTS, type Effect }
