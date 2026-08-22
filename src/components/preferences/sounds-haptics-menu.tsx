"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    BoneFractureBoldDuotoneIcon,
    MagicWand3BoldDuotoneIcon,
    SmartphoneVibrationBoldDuotoneIcon,
    UserHandUpBoldDuotoneIcon
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
import { useDevice } from "@/hooks/use-device"
import { usePreference } from "@/hooks/use-preference"
import { playPressSound } from "@/lib/sounds"
import { type AudioState, useAudioStore } from "@/stores/audio-store"
import { useHapticsStore } from "@/stores/haptics-store"

interface AudioPreferenceConfig {
    value: AudioState["audioMode"]
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
}

const MENU_CONFIG = {
    name: "Sounds & Haptics",
    icon: <BoneFractureBoldDuotoneIcon />
}

const AUDIO_PREFERENCES: Record<
    AudioState["audioMode"],
    AudioPreferenceConfig
> = {
    manual: {
        value: "manual",
        label: "Manual",
        description:
            "Manually press the volume button to toggle sound effects.",
        icon: <UserHandUpBoldDuotoneIcon />
    },
    auto: {
        value: "auto",
        label: "Auto",
        description:
            "Automatically capture first global interaction and turn on sound effects.",
        icon: (
            <MagicWand3BoldDuotoneIcon className="[--solar-secondary-opacity:0.4]" />
        )
    }
}

function SoundsHapticsMenu() {
    const { audioMode } = usePreference()
    const setAudioMode = useAudioStore((state) => state.setAudioMode)

    const isHapticEnabled = useHapticsStore((state) => state.isHapticEnabled)
    const setIsHapticEnabled = useHapticsStore(
        (state) => state.setIsHapticEnabled
    )

    const { isTouchDevice } = useDevice()

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {MENU_CONFIG.icon}
                {MENU_CONFIG.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-w-60">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Sound effects</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={audioMode}
                        onValueChange={(value: string) => {
                            const nextMode = value as AudioState["audioMode"]
                            setAudioMode(nextMode)

                            const eventName = "change_audio_preference"
                            const eventParams = { audio_mode: nextMode }
                            sendGAEvent("event", eventName, eventParams)

                            showMenuToast(
                                "Sound effects",
                                AUDIO_PREFERENCES[audioMode].label,
                                AUDIO_PREFERENCES[nextMode].label,
                                () => {
                                    setAudioMode(audioMode)
                                    if (audioMode === "auto") {
                                        useAudioStore
                                            .getState()
                                            .setIsAudioEnabled(true)
                                    } else {
                                        useAudioStore
                                            .getState()
                                            .setIsAudioEnabled(false)
                                    }
                                }
                            )

                            if (nextMode === "auto") {
                                useAudioStore.getState().setIsAudioEnabled(true)

                                playPressSound("button")
                            }
                        }}
                    >
                        {Object.values(AUDIO_PREFERENCES).map((preference) => (
                            <DropdownMenuRadioItem
                                key={preference.value}
                                value={preference.value}
                                closeOnClick={false}
                                description={preference.description}
                            >
                                {preference.icon}
                                {preference.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Haptics</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={isHapticEnabled}
                        onCheckedChange={(checked) => {
                            setIsHapticEnabled(checked)
                            const eventName = "change_haptic_preference"
                            const eventParams = { enabled: checked }
                            sendGAEvent("event", eventName, eventParams)

                            showMenuToast(
                                "Haptic feedback",
                                isHapticEnabled ? "On" : "Off",
                                checked ? "On" : "Off",
                                () => {
                                    setIsHapticEnabled(isHapticEnabled)
                                }
                            )
                        }}
                        disabled={!isTouchDevice}
                        closeOnClick={false}
                        description="Provide subtle vibrations on interactions. Mobile-only feature; may not work on some devices."
                    >
                        <SmartphoneVibrationBoldDuotoneIcon />
                        Haptic feedback
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { AUDIO_PREFERENCES, MENU_CONFIG, SoundsHapticsMenu }
