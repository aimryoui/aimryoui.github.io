"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    PanelBottom,
    PanelLeft,
    PanelLeftRightDashed,
    PanelRight,
    PanelTop,
    PanelTopBottomDashed
} from "lucide-react"

import { useDirection } from "@/components/ui/direction"
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

const MENU_CONFIG = {
    name: "Navigation"
}

const MOBILE_CONFIG = {
    triggerIcon: PanelTopBottomDashed,
    triggerText: "Toolbar position",
    options: [
        { value: "top", icon: PanelTop, text: "Top", disabled: true },
        { value: "bottom", icon: PanelBottom, text: "Bottom", disabled: false }
    ]
} as const

const DESKTOP_CONFIG = {
    triggerIcon: PanelLeftRightDashed,
    triggerText: "Sidebar position"
} as const

function NavigationBarPositionMenu() {
    const isMobile = useMediaQuery("lg")

    const sidebarPosition = useSidebarPositionStore((state) => state.position)
    const setSidebarPosition = useSidebarPositionStore(
        (state) => state.setPosition
    )

    const toolbarPosition = useToolbarPositionStore((state) => state.position)
    const setToolbarPosition = useToolbarPositionStore(
        (state) => state.setPosition
    )

    const position = isMobile ? toolbarPosition : sidebarPosition
    const setPosition = isMobile
        ? (setToolbarPosition as (v: string) => void)
        : (setSidebarPosition as (v: string) => void)

    const direction = useDirection()

    const desktopOptions = [
        {
            value: "inline-start",
            icon: direction === "rtl" ? PanelRight : PanelLeft,
            text: direction === "rtl" ? "Right" : "Left",
            disabled: false
        },
        {
            value: "inline-end",
            icon: direction === "rtl" ? PanelLeft : PanelRight,
            text: direction === "rtl" ? "Left" : "Right",
            disabled: false
        }
    ]

    const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG
    const options = isMobile ? MOBILE_CONFIG.options : desktopOptions
    const TriggerIcon = config.triggerIcon

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <TriggerIcon />
                {config.triggerText}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={(value: string) => {
                        setPosition(value)

                        const eventName = "change_navigation_position"
                        const eventParams = {
                            position: value,
                            is_mobile: isMobile
                        }
                        sendGAEvent("event", eventName, eventParams)
                    }}
                >
                    {options.map(({ value, icon: Icon, text, disabled }) => (
                        <DropdownMenuRadioItem
                            key={value}
                            value={value}
                            disabled={disabled}
                            onClick={() => {
                                setPosition(value)
                            }}
                        >
                            <Icon />
                            {text}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { MENU_CONFIG, NavigationBarPositionMenu }
