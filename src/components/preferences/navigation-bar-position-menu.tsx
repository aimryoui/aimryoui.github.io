"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    MirrorLeftBoldDuotoneIcon,
    MirrorRightBoldDuotoneIcon,
    WindowFrameBoldDuotoneIcon
} from "@solar-icons/react"

import { showMenuToast } from "@/components/preferences/menu-toast"
import { useDirection } from "@/components/ui/direction"
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES
} from "@/configs/navigation.config"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

const MENU_CONFIG = {
    name: "Navigation",
    icon: (
        <WindowFrameBoldDuotoneIcon
            className={cn(
                "[--solar-secondary-color:theme(colors.current)] [--solar-secondary-opacity:1]",
                "-scale-y-100 rtl:-scale-x-100",
                "first-of-type:*:!opacity-40 last-of-type:*:!opacity-20 not-[[style]]:*:opacity-100",
                {
                    lg: "first-of-type:*:!opacity-100 not-[[style]]:not-last-of-type:*:text-background nth-2:*:!opacity-20 nth-3:*:!opacity-20"
                }
            )}
        />
    )
}

const MOBILE_CONFIG = {
    triggerText: "Toolbar position",
    options: [
        {
            value: "top",
            icon: MirrorTopBoldDuotoneIcon,
            text: "Top",
            disabled: true
        },
        {
            value: "bottom",
            icon: MirrorBottomBoldDuotoneIcon,
            text: "Bottom",
            disabled: false
        }
    ]
} as const

const DESKTOP_CONFIG = { triggerText: "Sidebar position" } as const

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
            icon:
                direction === "rtl"
                    ? MirrorRightBoldDuotoneIcon
                    : MirrorLeftBoldDuotoneIcon,
            text: direction === "rtl" ? "Right" : "Left",
            disabled: false
        },
        {
            value: "inline-end",
            icon:
                direction === "rtl"
                    ? MirrorLeftBoldDuotoneIcon
                    : MirrorRightBoldDuotoneIcon,
            text: direction === "rtl" ? "Left" : "Right",
            disabled: false
        }
    ]

    const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG
    const options = isMobile ? MOBILE_CONFIG.options : desktopOptions

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {MENU_CONFIG.icon}
                {config.triggerText}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={(value: string) => {
                        if (value === position) return

                        setPosition(value)

                        const eventName = "change_navigation_position"
                        const eventParams = {
                            position: value,
                            is_mobile: isMobile
                        }
                        sendGAEvent("event", eventName, eventParams)

                        const prevOption = options.find(
                            (o) => o.value === position
                        )
                        const nextOption = options.find(
                            (o) => o.value === value
                        )
                        showMenuToast(
                            config.triggerText,
                            prevOption?.text ?? "",
                            nextOption?.text ?? "",
                            () => {
                                setPosition(position)
                                sendGAEvent("event", `${eventName}_undo`, eventParams)
                            }
                        )
                    }}
                >
                    {options.map(({ value, icon: Icon, text, disabled }) => (
                        <DropdownMenuRadioItem
                            key={value}
                            value={value}
                            isDefault={
                                isMobile
                                    ? value === DEFAULT_TOOLBAR_PREFERENCES
                                    : value === DEFAULT_SIDEBAR_PREFERENCES
                            }
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

function MirrorTopBoldDuotoneIcon() {
    return <MirrorLeftBoldDuotoneIcon className="rotate-90" />
}

function MirrorBottomBoldDuotoneIcon() {
    return <MirrorRightBoldDuotoneIcon className="rotate-90" />
}

export { DESKTOP_CONFIG, MENU_CONFIG, MOBILE_CONFIG, NavigationBarPositionMenu }
