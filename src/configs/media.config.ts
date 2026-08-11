const AVAILABLE_MEDIA_PREFERENCES = ["dim"] as const
type MediaPreference = (typeof AVAILABLE_MEDIA_PREFERENCES)[number]

const DISABLED_BY_DEFAULT: MediaPreference[] = []

const DEFAULT_MEDIA_PREFERENCES: MediaPreference[] =
    AVAILABLE_MEDIA_PREFERENCES.filter(
        (preference) => !DISABLED_BY_DEFAULT.includes(preference)
    )

const AUTOPLAY_PREFERENCES = ["always", "wifi", "never"] as const
type AutoplayPreference = (typeof AUTOPLAY_PREFERENCES)[number]
const DEFAULT_AUTOPLAY_PREFERENCE: AutoplayPreference = "wifi"

const AUTOPLAY_TYPES = ["videos", "gifs"] as const
type AutoplayType = (typeof AUTOPLAY_TYPES)[number]
const DEFAULT_AUTOPLAY_TYPES: AutoplayType[] = ["videos"]

export {
    AUTOPLAY_PREFERENCES,
    AUTOPLAY_TYPES,
    type AutoplayPreference,
    type AutoplayType,
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_AUTOPLAY_PREFERENCE,
    DEFAULT_AUTOPLAY_TYPES,
    DEFAULT_MEDIA_PREFERENCES,
    type MediaPreference
}
