"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    AlignLeftBoldDuotoneIcon,
    AlignRightBoldDuotoneIcon,
    Signpost2BoldDuotoneIcon
} from "@solar-icons/react"
import { Languages } from "lucide-react"

import { showMenuToast } from "@/components/preferences/menu-toast"
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    DEFAULT_DIRECTION_PREFERENCE,
    type DirectionPreference
} from "@/configs/direction.config"
import { useDirectionStore } from "@/stores/direction-store"

interface DirectionPreferenceConfig {
    value: DirectionPreference
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
}

const MENU_CONFIG = {
    name: "Direction",
    icon: <Signpost2BoldDuotoneIcon />,
    description: "Change reading direction. For development purposes."
}

const DIRECTION_PREFERENCES: Record<
    DirectionPreference,
    DirectionPreferenceConfig
> = {
    ltr: {
        value: "ltr",
        label: "Left to Right",
        description: "Force Left to Right direction.",
        icon: <AlignLeftBoldDuotoneIcon />
    },
    rtl: {
        value: "rtl",
        label: "Right to Left",
        description: "Force Right to Left direction.",
        icon: <AlignRightBoldDuotoneIcon />
    },
    auto: {
        value: "auto",
        label: "Follow language",
        description: "Follow language direction.",
        icon: <Languages />
    }
}

function DirectionMenu() {
    const directionPreference = useDirectionStore((state) => state.preference)
    const setDirectionPreference = useDirectionStore(
        (state) => state.setPreference
    )

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger description={MENU_CONFIG.description}>
                {MENU_CONFIG.icon}
                {MENU_CONFIG.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={directionPreference}
                    onValueChange={(value: string) => {
                        if (value === directionPreference) return

                        setDirectionPreference(value as DirectionPreference)

                        const eventName = "change_direction_preference"
                        const eventParams = { direction_preference: value }
                        sendGAEvent("event", eventName, eventParams)

                        showMenuToast(
                            "Direction",
                            DIRECTION_PREFERENCES[directionPreference].label,
                            DIRECTION_PREFERENCES[value as DirectionPreference]
                                .label,
                            () => {
                                setDirectionPreference(directionPreference)
                                sendGAEvent(
                                    "event",
                                    `${eventName}_undo`,
                                    eventParams
                                )
                            }
                        )
                    }}
                >
                    {Object.values(DIRECTION_PREFERENCES).map((preference) => (
                        <DropdownMenuRadioItem
                            key={preference.value}
                            // dir={preference.value}
                            value={preference.value}
                            isDefault={
                                preference.value
                                === DEFAULT_DIRECTION_PREFERENCE
                            }
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

export { DIRECTION_PREFERENCES, DirectionMenu, MENU_CONFIG }
