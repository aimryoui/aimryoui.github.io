import { z } from "zod"

const AVAILABLE_DIRECTION_PREFERENCES = ["auto", "ltr", "rtl"] as const
const directionPreferenceSchema = z.enum(AVAILABLE_DIRECTION_PREFERENCES)
type DirectionPreference = z.infer<typeof directionPreferenceSchema>

const DEFAULT_DIRECTION_PREFERENCE = "auto" as DirectionPreference

export type { DirectionPreference }
export {
    AVAILABLE_DIRECTION_PREFERENCES,
    DEFAULT_DIRECTION_PREFERENCE,
    directionPreferenceSchema
}
