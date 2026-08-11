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
    const videoAutoplay = useMediaStore((state) => state.videoAutoplay)
    const setVideoAutoplay = useMediaStore((state) => state.setVideoAutoplay)
    const gifAutoplay = useMediaStore((state) => state.gifAutoplay)
    const setGifAutoplay = useMediaStore((state) => state.setGifAutoplay)

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
                    <DropdownMenuSubTrigger description="Play animated media when in view. Disabled with reduced motion.">
                        <ImagePlay />
                        Auto-play
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="max-w-64">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Videos</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={videoAutoplay}
                                onValueChange={(value: string) => {
                                    setVideoAutoplay(
                                        value as AutoplayPreference
                                    )

                                    const eventName =
                                        "change_video_autoplay_preference"
                                    const eventParams = { autoplay: value }
                                    sendGAEvent("event", eventName, eventParams)
                                }}
                            >
                                {AUTOPLAY_PREFERENCES.map((preference) => (
                                    <DropdownMenuRadioItem
                                        key={preference}
                                        value={preference}
                                        closeOnClick={false}
                                        disabled={reduceMotion}
                                    >
                                        {AUTOPLAY_OPTIONS[preference].icon}
                                        {AUTOPLAY_OPTIONS[preference].label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>GIFs</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={gifAutoplay}
                                onValueChange={(value: string) => {
                                    setGifAutoplay(value as AutoplayPreference)

                                    const eventName =
                                        "change_gif_autoplay_preference"
                                    const eventParams = { autoplay: value }
                                    sendGAEvent("event", eventName, eventParams)
                                }}
                            >
                                {AUTOPLAY_PREFERENCES.map((preference) => (
                                    <DropdownMenuRadioItem
                                        key={preference}
                                        value={preference}
                                        closeOnClick={false}
                                        disabled={reduceMotion}
                                    >
                                        {AUTOPLAY_OPTIONS[preference].icon}
                                        {AUTOPLAY_OPTIONS[preference].label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { AUTOPLAY_OPTIONS, MEDIA_PREFERENCES, MENU_CONFIG, MediaMenu }
