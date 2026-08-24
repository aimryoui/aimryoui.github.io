import { z } from "zod"

const AVAILABLE_AUDIO_MODES = ["manual", "auto"] as const
const audioModeSchema = z.enum(AVAILABLE_AUDIO_MODES)
type AudioMode = z.infer<typeof audioModeSchema>

const DEFAULT_AUDIO_PREFERENCES = {
    isAudioEnabled: false,
    audioMode: "manual" as AudioMode
}

export type { AudioMode }
export { AVAILABLE_AUDIO_MODES, audioModeSchema, DEFAULT_AUDIO_PREFERENCES }
