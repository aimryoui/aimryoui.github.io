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

export {
    AUTOPLAY_PREFERENCES,
    type AutoplayPreference,
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_AUTOPLAY_PREFERENCE,
    DEFAULT_MEDIA_PREFERENCES,
    type MediaPreference
}
