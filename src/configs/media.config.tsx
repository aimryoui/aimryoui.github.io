const AVAILABLE_MEDIA_PREFERENCES = ["dim", "autoplay"] as const
type MediaPreference = (typeof AVAILABLE_MEDIA_PREFERENCES)[number]

const DISABLED_BY_DEFAULT: MediaPreference[] = []

const DEFAULT_MEDIA_PREFERENCES: MediaPreference[] =
    AVAILABLE_MEDIA_PREFERENCES.filter(
        (preference) => !DISABLED_BY_DEFAULT.includes(preference)
    )

const MEDIA_PREFERENCE_LABELS: Record<MediaPreference, string> = {
    dim: "Dim white point",
    autoplay: "Auto-play media"
}

const MEDIA_PREFERENCE_DESCRIPTIONS: Record<MediaPreference, React.ReactNode> =
    {
        dim: "Reduce white point brightness of media on dark mode",
        autoplay: "Auto-play videos when in view, does not affect GIFs"
    }

export {
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_MEDIA_PREFERENCES,
    MEDIA_PREFERENCE_DESCRIPTIONS,
    MEDIA_PREFERENCE_LABELS,
    type MediaPreference
}
