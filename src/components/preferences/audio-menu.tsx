import { sendGAEvent } from "@next/third-parties/google"

import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { playPressSound } from "@/lib/sounds"
import { type AudioState, useAudioStore } from "@/stores/audio-store"

function AudioMenu() {
    const audioMode = useAudioStore((state) => state.audioMode)
    const setAudioMode = useAudioStore((state) => state.setAudioMode)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Audio mode</DropdownMenuSubTrigger>
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
                    <DropdownMenuRadioItem
                        value="manual"
                        closeOnClick
                        description={
                            <>
                                Manually press the audio button to turn on audio
                            </>
                        }
                    >
                        Manual
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value="auto"
                        closeOnClick
                        description={
                            <>
                                Automatically capture first press interaction
                                and turn on audio
                            </>
                        }
                    >
                        Auto
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { AudioMenu }
