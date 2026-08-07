const AVAILABLE_EFFECTS = ["target-cursor"] as const
type Effect = (typeof AVAILABLE_EFFECTS)[number]

const DISABLED_BY_DEFAULT: Effect[] = []

const DEFAULT_EFFECTS: Effect[] = AVAILABLE_EFFECTS.filter(
    (effect) => !DISABLED_BY_DEFAULT.includes(effect)
)

const EFFECT_LABELS: Record<Effect, string> = {
    "target-cursor": "Target cursor"
}

export type { Effect }
export { AVAILABLE_EFFECTS, DEFAULT_EFFECTS, EFFECT_LABELS }
