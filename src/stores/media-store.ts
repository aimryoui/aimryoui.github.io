import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    AUTOPLAY_PREFERENCES,
    type AutoplayPreference,
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_GIF_AUTOPLAY_PREFERENCE,
    DEFAULT_MEDIA_PREFERENCES,
    DEFAULT_VIDEO_AUTOPLAY_PREFERENCE,
    type MediaPreference
} from "@/configs/media.config"

const mediaPreferenceSchema = z.enum(AVAILABLE_MEDIA_PREFERENCES)
const autoplayPreferenceSchema = z.enum(AUTOPLAY_PREFERENCES)
const mediaStoreSchema = z.object({
    preferences: z
        .array(mediaPreferenceSchema)
        .catch(DEFAULT_MEDIA_PREFERENCES),
    videoAutoplay: autoplayPreferenceSchema.catch(
        DEFAULT_VIDEO_AUTOPLAY_PREFERENCE
    ),
    gifAutoplay: autoplayPreferenceSchema.catch(DEFAULT_GIF_AUTOPLAY_PREFERENCE)
})

interface MediaStore {
    preferences: MediaPreference[]
    videoAutoplay: AutoplayPreference
    gifAutoplay: AutoplayPreference
    setPreferences: (preferences: MediaPreference[]) => void
    setVideoAutoplay: (autoplay: AutoplayPreference) => void
    setGifAutoplay: (autoplay: AutoplayPreference) => void
    togglePreference: (preference: MediaPreference) => void
    hasPreference: (preference: MediaPreference) => boolean
    reset: () => void
}

const useMediaStore = create<MediaStore>()(
    persist(
        (set, get) => ({
            preferences: DEFAULT_MEDIA_PREFERENCES,
            videoAutoplay: DEFAULT_VIDEO_AUTOPLAY_PREFERENCE,
            gifAutoplay: DEFAULT_GIF_AUTOPLAY_PREFERENCE,
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
            setVideoAutoplay: (autoplay) => {
                set({ videoAutoplay: autoplay })
            },
            setGifAutoplay: (autoplay) => {
                set({ gifAutoplay: autoplay })
            },
            reset: () => {
                get().setPreferences(DEFAULT_MEDIA_PREFERENCES)
                set({
                    videoAutoplay: DEFAULT_VIDEO_AUTOPLAY_PREFERENCE,
                    gifAutoplay: DEFAULT_GIF_AUTOPLAY_PREFERENCE
                })
            }
        }),
        {
            name: "nhn-media-preferences",
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
