const AVAILABLE_MEDIA_PREFERENCES = ["dim", "autoplay"] as const
type MediaPreference = (typeof AVAILABLE_MEDIA_PREFERENCES)[number]

const DISABLED_BY_DEFAULT: MediaPreference[] = []

const DEFAULT_MEDIA_PREFERENCES: MediaPreference[] =
    AVAILABLE_MEDIA_PREFERENCES.filter(
        (preference) => !DISABLED_BY_DEFAULT.includes(preference)
    )

export {
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_MEDIA_PREFERENCES,
    type MediaPreference
}
