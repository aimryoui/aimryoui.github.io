import { sendGAEvent } from "@next/third-parties/google"
import { FileStack, OctagonMinus, ThumbsUp } from "lucide-react"

import { System } from "@/components/icons/icons"
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { type MotionPreference, useMotionStore } from "@/stores/motion-store"

function MotionMenu() {
    const motionPreference = useMotionStore((state) => state.preference)
    const setMotionPreference = useMotionStore((state) => state.setPreference)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <FileStack />
                Motion
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={motionPreference}
                    onValueChange={(value: string) => {
                        setMotionPreference(value as MotionPreference)

                        const eventName = "change_motion_preference"
                        const eventParams = { motion_preference: value }
                        sendGAEvent("event", eventName, eventParams)
                    }}
                >
                    <DropdownMenuRadioItem value="preferred" closeOnClick>
                        <ThumbsUp />
                        Preferred
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="reduced" closeOnClick>
                        <OctagonMinus />
                        Reduced
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system" closeOnClick>
                        <System className="size-4.5" />
                        Follow system
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { MotionMenu }
