import { sendGAEvent } from "@next/third-parties/google"
import { OctagonMinus, SquareStack, ThumbsUp } from "lucide-react"

import { System } from "@/components/icons/icons"
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { type MotionPreference, useMotionStore } from "@/stores/motion-store"

interface MotionPreferenceConfig {
    value: MotionPreference
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
}

const MENU_NAME = "Motion"

const MOTION_PREFERENCES: Record<MotionPreference, MotionPreferenceConfig> = {
    preferred: {
        value: "preferred",
        label: "Preferred",
        description:
            "Enable all motion effects, ignore system motion preferences",
        icon: <ThumbsUp />
    },
    reduced: {
        value: "reduced",
        label: "Reduced",
        description:
            "Reduce motion effects that may be problematic for some users",
        icon: <OctagonMinus />
    },
    system: {
        value: "system",
        label: "Follow system",
        description: "Follow system motion preferences",
        icon: <System className="size-4.5" />
    }
}

function MotionMenu() {
    const motionPreference = useMotionStore((state) => state.preference)
    const setMotionPreference = useMotionStore((state) => state.setPreference)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <SquareStack />
                {MENU_NAME}
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
                    {Object.values(MOTION_PREFERENCES).map((preference) => (
                        <DropdownMenuRadioItem
                            key={preference.value}
                            value={preference.value}
                            closeOnClick
                            description={preference.description}
                            srOnlyDescription
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

export { MENU_NAME, MOTION_PREFERENCES, MotionMenu }
