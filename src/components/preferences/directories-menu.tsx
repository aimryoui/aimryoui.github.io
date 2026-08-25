"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { RouteBoldDuotoneIcon } from "@solar-icons/react"

import { showMenuToast } from "@/components/preferences/menu-toast"
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import {
    DEFAULT_DIRECTORIES_MENU_PREFERENCE,
    useDirectoriesStore
} from "@/stores/directories-store"

const MENU_CONFIG = {
    name: "Directories Menu",
    icon: <RouteBoldDuotoneIcon />,
    description:
        "Enable the additional dropdown in the toolbar. For development purposes."
}

function DirectoriesMenu() {
    const isEnabled = useDirectoriesStore(
        (state) => state.isDirectoriesMenuEnabled
    )
    const setIsEnabled = useDirectoriesStore(
        (state) => state.setIsDirectoriesMenuEnabled
    )

    return (
        <DropdownMenuCheckboxItem
            checked={isEnabled}
            isDefault={DEFAULT_DIRECTORIES_MENU_PREFERENCE}
            onCheckedChange={(checked) => {
                setIsEnabled(checked)

                const eventName = "change_directories_menu_preference"
                const eventParams = {
                    enabled: checked
                }
                sendGAEvent("event", eventName, eventParams)

                showMenuToast(
                    MENU_CONFIG.name,
                    isEnabled ? "On" : "Off",
                    checked ? "On" : "Off",
                    () => {
                        setIsEnabled(isEnabled)
                    }
                )
            }}
            description={MENU_CONFIG.description}
        >
            {MENU_CONFIG.icon}
            {MENU_CONFIG.name}
        </DropdownMenuCheckboxItem>
    )
}

export { DirectoriesMenu, MENU_CONFIG }
