"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { MouseBoldDuotoneIcon } from "@solar-icons/react"

import { showMenuToast } from "@/components/preferences/menu-toast"
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { usePreference } from "@/hooks/use-preference"
import {
    DEFAULT_SMOOTH_SCROLLING_PREFERENCE,
    useSmoothScrollingStore
} from "@/stores/smooth-scrolling-store"

const MENU_CONFIG = {
    name: "Smooth scrolling",
    icon: <MouseBoldDuotoneIcon />,
    description:
        "Enable page & scroll areas smooth scrolling. May affect performance. Disabled with reduced motion."
}

function SmoothScrollingMenu() {
    const isEnabled = useSmoothScrollingStore(
        (state) => state.isSmoothScrollingEnabled
    )
    const setIsEnabled = useSmoothScrollingStore(
        (state) => state.setIsSmoothScrollingEnabled
    )
    const { motionReduced } = usePreference()

    return (
        <DropdownMenuCheckboxItem
            checked={isEnabled && !motionReduced}
            isDefault={DEFAULT_SMOOTH_SCROLLING_PREFERENCE}
            disabled={motionReduced}
            onCheckedChange={(checked) => {
                setIsEnabled(checked)

                const eventName = "change_smooth_scrolling_preference"
                const eventParams = {
                    enabled: checked
                }
                sendGAEvent("event", eventName, eventParams)

                showMenuToast(
                    "Smooth scrolling",
                    isEnabled ? "On" : "Off",
                    checked ? "On" : "Off",
                    () => {
                        setIsEnabled(isEnabled)
                    }
                )
            }}
            closeOnClick={false}
            description={MENU_CONFIG.description}
        >
            <span className="flex items-center gap-2">
                {MENU_CONFIG.icon}
                {MENU_CONFIG.name}
            </span>
        </DropdownMenuCheckboxItem>
    )
}

export { MENU_CONFIG, SmoothScrollingMenu }
