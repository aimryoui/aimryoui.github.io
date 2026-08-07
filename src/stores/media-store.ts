import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_MEDIA_PREFERENCES,
    type MediaPreference
} from "@/configs/media.config"

const mediaPreferenceSchema = z.enum(AVAILABLE_MEDIA_PREFERENCES)
const mediaStoreSchema = z.object({
    preferences: z.array(mediaPreferenceSchema)
})

interface MediaStore {
    preferences: MediaPreference[]
    setPreferences: (preferences: MediaPreference[]) => void
    togglePreference: (preference: MediaPreference) => void
    hasPreference: (preference: MediaPreference) => boolean
}

const useMediaStore = create<MediaStore>()(
    persist(
        (set, get) => ({
            preferences: DEFAULT_MEDIA_PREFERENCES,
            setPreferences: (preferences) => {
                set({ preferences })
                if (typeof document !== "undefined") {
                    document.documentElement.setAttribute(
                        "data-media",
                        preferences.length > 0 ? preferences.join(" ") : "null"
                    )
                }
            },
            togglePreference: (preference) => {
                const current = get().preferences
                const next = current.includes(preference)
                    ? current.filter((p) => p !== preference)
                    : [...current, preference]
                get().setPreferences(next)
            },
            hasPreference: (preference) => get().preferences.includes(preference)
        }),
        {
            name: "media-settings",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => {
                const parsed = mediaStoreSchema.safeParse(persistedState)
                return {
                    ...currentState,
                    ...(parsed.success ? parsed.data : {})
                }
            }
        }
    )
)

export { useMediaStore }
