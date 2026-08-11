import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    AUTOPLAY_PREFERENCES,
    AUTOPLAY_TYPES,
    type AutoplayPreference,
    type AutoplayType,
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_AUTOPLAY_PREFERENCE,
    DEFAULT_AUTOPLAY_TYPES,
    DEFAULT_MEDIA_PREFERENCES,
    type MediaPreference
} from "@/configs/media.config"

const mediaPreferenceSchema = z.enum(AVAILABLE_MEDIA_PREFERENCES)
const autoplayPreferenceSchema = z.enum(AUTOPLAY_PREFERENCES)
const autoplayTypeSchema = z.enum(AUTOPLAY_TYPES)
const mediaStoreSchema = z.object({
    preferences: z
        .array(mediaPreferenceSchema)
        .catch(DEFAULT_MEDIA_PREFERENCES),
    autoplay: autoplayPreferenceSchema.catch(DEFAULT_AUTOPLAY_PREFERENCE),
    autoplayTypes: z.array(autoplayTypeSchema).catch(DEFAULT_AUTOPLAY_TYPES)
})

interface MediaStore {
    preferences: MediaPreference[]
    autoplay: AutoplayPreference
    autoplayTypes: AutoplayType[]
    setPreferences: (preferences: MediaPreference[]) => void
    setAutoplay: (autoplay: AutoplayPreference) => void
    setAutoplayTypes: (types: AutoplayType[]) => void
    toggleAutoplayType: (type: AutoplayType) => void
    togglePreference: (preference: MediaPreference) => void
    hasPreference: (preference: MediaPreference) => boolean
}

const useMediaStore = create<MediaStore>()(
    persist(
        (set, get) => ({
            preferences: DEFAULT_MEDIA_PREFERENCES,
            autoplay: DEFAULT_AUTOPLAY_PREFERENCE,
            autoplayTypes: DEFAULT_AUTOPLAY_TYPES,
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
            hasPreference: (preference) =>
                get().preferences.includes(preference),
            setAutoplay: (autoplay) => {
                set({ autoplay })
            },
            setAutoplayTypes: (types) => {
                set({ autoplayTypes: types })
            },
            toggleAutoplayType: (type) => {
                const current = get().autoplayTypes
                const next = current.includes(type)
                    ? current.filter((t) => t !== type)
                    : [...current, type]
                set({ autoplayTypes: next })
            }
        }),
        {
            name: "media-preferences",
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
