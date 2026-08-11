"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { ImagePlay, Images, Play, PlayOff, Sunset, Wifi } from "lucide-react"

import {
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    AUTOPLAY_PREFERENCES,
    AUTOPLAY_TYPES,
    type AutoplayPreference,
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

const MENU_CONFIG = {
    name: "Media",
    icon: Images
}

const MEDIA_PREFERENCES: Record<MediaPreference, MediaPreferenceConfig> = {
    dim: {
        label: "Dim white point",
        description: "Reduce white point brightness of media on dark mode.",
        icon: <Sunset />
    }
}

const AUTOPLAY_OPTIONS: Record<
    AutoplayPreference,
    { label: string; icon: React.ReactNode }
> = {
    always: {
        label: "Always auto-play",
        icon: <Play />
    },
    wifi: {
        label: "Wi-Fi connections only",
        icon: <Wifi />
    },
    never: {
        label: "Never auto-play",
        icon: <PlayOff />
    }
}

function MediaMenu() {
    const preferences = useMediaStore((state) => state.preferences)
    const togglePreference = useMediaStore((state) => state.togglePreference)
    const autoplay = useMediaStore((state) => state.autoplay)
    const setAutoplay = useMediaStore((state) => state.setAutoplay)
    const autoplayTypes = useMediaStore((state) => state.autoplayTypes)
    const toggleAutoplayType = useMediaStore(
        (state) => state.toggleAutoplayType
    )

    const reduceMotion = useReducedMotion()

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <MENU_CONFIG.icon />
                {MENU_CONFIG.name}
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

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                        description="Play animated media when in view. Disabled with reduced motion."
                    >
                        <ImagePlay />
                        Auto-play
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="max-w-64">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Applying to</DropdownMenuLabel>
                            {AUTOPLAY_TYPES.map((type) => (
                                <DropdownMenuCheckboxItem
                                    key={type}
                                    checked={autoplayTypes.includes(type)}
                                    onCheckedChange={(checked) => {
                                        toggleAutoplayType(type)

                                        const eventName = "change_autoplay_type"
                                        const eventParams = {
                                            type,
                                            enabled: checked
                                        }
                                        sendGAEvent(
                                            "event",
                                            eventName,
                                            eventParams
                                        )
                                    }}
                                    closeOnClick={false}
                                    disabled={reduceMotion}
                                >
                                    {type === "videos" ? "Videos" : "GIFs"}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={autoplay}
                            onValueChange={(value: string) => {
                                setAutoplay(value as AutoplayPreference)

                                const eventName = "change_autoplay_preference"
                                const eventParams = { autoplay: value }
                                sendGAEvent("event", eventName, eventParams)
                            }}
                        >
                            {AUTOPLAY_PREFERENCES.map((preference) => (
                                <DropdownMenuRadioItem
                                    key={preference}
                                    value={preference}
                                    closeOnClick={false}
                                    disabled={reduceMotion || autoplayTypes.length === 0}
                                >
                                    {AUTOPLAY_OPTIONS[preference].icon}
                                    {AUTOPLAY_OPTIONS[preference].label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { AUTOPLAY_OPTIONS, MEDIA_PREFERENCES, MENU_CONFIG, MediaMenu }
