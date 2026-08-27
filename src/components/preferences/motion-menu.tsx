"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    LikeBoldDuotoneIcon,
    MinusCircleBoldDuotoneIcon,
    MonitorBoldDuotoneIcon,
    ThreeSquaresBoldDuotoneIcon
} from "@solar-icons/react"

import { showMenuToast } from "@/components/preferences/menu-toast"
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { DEFAULT_MOTION_PREFERENCES } from "@/configs/motion.config"
import { type MotionPreference, useMotionStore } from "@/stores/motion-store"

interface MotionPreferenceConfig {
    value: MotionPreference
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
}

const MENU_CONFIG = {
    name: "Motion",
    icon: <ThreeSquaresBoldDuotoneIcon />
}

const MOTION_PREFERENCES: Record<MotionPreference, MotionPreferenceConfig> = {
    preferred: {
        value: "preferred",
        label: "Preferred",
        description:
            "Enable all motion effects, ignore system motion preferences.",
        icon: (
            <LikeBoldDuotoneIcon className="translate-x-[.5px] [--solar-secondary-opacity:0.4]" />
        )
    },
    reduced: {
        value: "reduced",
        label: "Reduced",
        description:
            "Reduce motion effects that may be problematic for some users.",
        icon: (
            <MinusCircleBoldDuotoneIcon className="scale-105 last-of-type:*:origin-center last-of-type:*:scale-125" />
        )
    },
    system: {
        value: "system",
        label: "Follow system",
        description: "Follow system motion preferences.",
        icon: <MonitorBoldDuotoneIcon />
    }
}

function MotionMenu() {
    const motionPreference = useMotionStore((state) => state.preference)
    const setMotionPreference = useMotionStore((state) => state.setPreference)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {MENU_CONFIG.icon}
                {MENU_CONFIG.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={motionPreference}
                    onValueChange={(value: string) => {
                        if (value === motionPreference) return

                        setMotionPreference(value as MotionPreference)

                        const eventName = "change_motion_preference"
                        const eventParams = { motion_preference: value }
                        sendGAEvent("event", eventName, eventParams)

                        showMenuToast(
                            "Motion",
                            MOTION_PREFERENCES[motionPreference].label,
                            MOTION_PREFERENCES[value as MotionPreference].label,
                            () => {
                                setMotionPreference(motionPreference)
                                sendGAEvent(
                                    "event",
                                    `${eventName}_undo`,
                                    eventParams
                                )
                            }
                        )
                    }}
                >
                    {Object.values(MOTION_PREFERENCES).map((preference) => (
                        <DropdownMenuRadioItem
                            key={preference.value}
                            value={preference.value}
                            isDefault={
                                preference.value === DEFAULT_MOTION_PREFERENCES
                            }
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

export { MENU_CONFIG, MOTION_PREFERENCES, MotionMenu }
