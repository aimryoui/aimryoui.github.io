import { sendGAEvent } from "@next/third-parties/google"
import { AudioLines, Loader, ToggleLeft } from "lucide-react"

import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { playPressSound } from "@/lib/sounds"
import { type AudioState, useAudioStore } from "@/stores/audio-store"

interface AudioPreferenceConfig {
    value: AudioState["audioMode"]
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
}

const MENU_NAME = "Sound effects"

const AUDIO_PREFERENCES: Record<
    AudioState["audioMode"],
    AudioPreferenceConfig
> = {
    manual: {
        value: "manual",
        label: "Manual",
        description:
            "Manually press the volume button to toggle sound effects.",
        icon: <ToggleLeft />
    },
    auto: {
        value: "auto",
        label: "Auto",
        description:
            "Automatically capture first global press interaction and turn on sound effects.",
        icon: <Loader />
    }
}

function AudioMenu() {
    const audioMode = useAudioStore((state) => state.audioMode)
    const setAudioMode = useAudioStore((state) => state.setAudioMode)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <AudioLines />
                {MENU_NAME}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={audioMode}
                    onValueChange={(value: string) => {
                        const nextMode = value as AudioState["audioMode"]
                        setAudioMode(nextMode)

                        const eventName = "change_audio_preference"
                        const eventParams = { audio_mode: nextMode }
                        sendGAEvent("event", eventName, eventParams)

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
                            closeOnClick
                            description={preference.description}
                        >
                            {preference.icon}
                            {preference.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { AUDIO_PREFERENCES, AudioMenu, MENU_NAME }
