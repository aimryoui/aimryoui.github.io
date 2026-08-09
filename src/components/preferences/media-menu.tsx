"use client"

import { useEffect } from "react"

import { sendGAEvent } from "@next/third-parties/google"
import { ImagePlay, Images, Sunset } from "lucide-react"

import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    AVAILABLE_MEDIA_PREFERENCES,
    type MediaPreference
} from "@/configs/media.config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useMediaStore } from "@/stores/media-store"

interface MediaPreferenceConfig {
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
    shouldDisable?: (reduceMotion: boolean) => boolean
}

const MENU_NAME = "Media"

const MEDIA_PREFERENCES: Record<MediaPreference, MediaPreferenceConfig> = {
    dim: {
        label: "Dim white point",
        description: "Reduce white point brightness of media on dark mode.",
        icon: <Sunset />
    },
    autoplay: {
        label: "Auto-play media",
        description:
            "Auto-play videos when in view, does not affect GIFs. Disabled with reduced motion.",
        icon: <ImagePlay />,
        shouldDisable: (reduceMotion) => reduceMotion
    }
}

function MediaMenu() {
    const preferences = useMediaStore((state) => state.preferences)
    const togglePreference = useMediaStore((state) => state.togglePreference)
    const setPreferences = useMediaStore((state) => state.setPreferences)

    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const nextPreferences = preferences.filter(
            (preference) =>
                !MEDIA_PREFERENCES[preference].shouldDisable?.(reduceMotion)
        )

        if (nextPreferences.length !== preferences.length) {
            setPreferences(nextPreferences)
        }
    }, [reduceMotion, preferences, setPreferences])

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Images />
                {MENU_NAME}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {AVAILABLE_MEDIA_PREFERENCES.map((preference) => (
                    <DropdownMenuCheckboxItem
                        key={preference}
                        checked={preferences.includes(preference)}
                        onCheckedChange={(checked) => {
                            togglePreference(preference)

                            const eventName = "change_media_preference"
                            const eventParams = { preference, enabled: checked }
                            sendGAEvent("event", eventName, eventParams)
                        }}
                        disabled={MEDIA_PREFERENCES[preference].shouldDisable?.(
                            reduceMotion
                        )}
                        closeOnClick={false}
                        description={MEDIA_PREFERENCES[preference].description}
                    >
                        {MEDIA_PREFERENCES[preference].icon}
                        {MEDIA_PREFERENCES[preference].label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { MEDIA_PREFERENCES, MENU_NAME, MediaMenu }
