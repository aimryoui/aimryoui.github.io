import { z } from "zod"

const AVAILABLE_MOTION_PREFERENCES = ["system", "preferred", "reduced"] as const
const motionPreferenceSchema = z.enum(AVAILABLE_MOTION_PREFERENCES)
type MotionPreference = z.infer<typeof motionPreferenceSchema>

const DEFAULT_MOTION_PREFERENCES = "system" as MotionPreference

export type { MotionPreference }
export {
    AVAILABLE_MOTION_PREFERENCES,
    DEFAULT_MOTION_PREFERENCES,
    motionPreferenceSchema
}
