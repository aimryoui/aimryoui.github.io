"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    ClapperboardPlayBoldDuotoneIcon,
    ForbiddenCircleBoldDuotoneIcon,
    GalleryWideBoldDuotoneIcon,
    PlayBoldDuotoneIcon,
    SunsetBoldDuotoneIcon,
    WiFiBoldDuotoneIcon
} from "@solar-icons/react"

import { showMenuToast } from "@/components/preferences/menu-toast"
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
import { usePreference } from "@/hooks/use-preference"
import { useMediaStore } from "@/stores/media-store"

interface MediaPreferenceConfig {
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
    shouldDisable?: (motionReduced: boolean) => boolean
}

const MENU_CONFIG = {
    name: "Media",
    icon: <GalleryWideBoldDuotoneIcon className="mb-0.25" />
}

const MEDIA_PREFERENCES: Record<MediaPreference, MediaPreferenceConfig> = {
    dim: {
        label: "Dim white point",
        description: "Reduce white point brightness of media on dark mode.",
        icon: <SunsetBoldDuotoneIcon />
    }
}

const AUTOPLAY_OPTIONS: Record<
    AutoplayPreference,
    { label: string; labelShort: string; icon: React.ReactNode }
> = {
    always: {
        label: "Always auto-play",
        labelShort: "Always",
        icon: <PlayBoldDuotoneIcon className="-translate-x-0.25" />
    },
    wifi: {
        label: "Wi-Fi connections only",
        labelShort: "Wi-Fi only",
        icon: (
            <WiFiBoldDuotoneIcon
                secondaryOpacity={1}
                className="[--solar-secondary-opacity:0.4]"
            />
        )
    },
    never: {
        label: "Never auto-play",
        labelShort: "Never",
        icon: <ForbiddenCircleBoldDuotoneIcon />
    }
}

function MediaMenu() {
    const preferences = useMediaStore((state) => state.preferences)
    const togglePreference = useMediaStore((state) => state.togglePreference)
    const videoAutoplay = useMediaStore((state) => state.videoAutoplay)
    const setVideoAutoplay = useMediaStore((state) => state.setVideoAutoplay)
    const gifAutoplay = useMediaStore((state) => state.gifAutoplay)
    const setGifAutoplay = useMediaStore((state) => state.setGifAutoplay)

    const { motionReduced } = usePreference()

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {MENU_CONFIG.icon}
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

                            showMenuToast(
                                MEDIA_PREFERENCES[preference].label,
                                checked ? "Off" : "On",
                                checked ? "On" : "Off",
                                () => {
                                    togglePreference(preference)
                                }
                            )
                        }}
                        disabled={MEDIA_PREFERENCES[preference].shouldDisable?.(
                            motionReduced
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
                        <ClapperboardPlayBoldDuotoneIcon />
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

                                    showMenuToast(
                                        "Videos Auto-play",
                                        AUTOPLAY_OPTIONS[videoAutoplay]
                                            .labelShort,
                                        AUTOPLAY_OPTIONS[
                                            value as AutoplayPreference
                                        ].labelShort,
                                        () => {
                                            setVideoAutoplay(videoAutoplay)
                                        }
                                    )
                                }}
                            >
                                {AUTOPLAY_PREFERENCES.map((preference) => (
                                    <DropdownMenuRadioItem
                                        key={preference}
                                        value={preference}
                                        closeOnClick={false}
                                        disabled={motionReduced}
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

                                    showMenuToast(
                                        "GIFs Auto-play",
                                        AUTOPLAY_OPTIONS[gifAutoplay]
                                            .labelShort,
                                        AUTOPLAY_OPTIONS[
                                            value as AutoplayPreference
                                        ].labelShort,
                                        () => {
                                            setGifAutoplay(gifAutoplay)
                                        }
                                    )
                                }}
                            >
                                {AUTOPLAY_PREFERENCES.map((preference) => (
                                    <DropdownMenuRadioItem
                                        key={preference}
                                        value={preference}
                                        closeOnClick={false}
                                        disabled={motionReduced}
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
