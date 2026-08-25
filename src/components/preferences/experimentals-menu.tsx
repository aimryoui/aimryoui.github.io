"use client"

import { TestTubeMinimalisticBoldDuotoneIcon } from "@solar-icons/react"

import { DirectionMenu } from "@/components/preferences/direction-menu"
import { DirectoriesMenu } from "@/components/preferences/directories-menu"
import { SmoothScrollingMenu } from "@/components/preferences/smooth-scrolling-menu"
import {
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

const MENU_CONFIG = {
    name: "Experimentals",
    icon: <TestTubeMinimalisticBoldDuotoneIcon />
}

function ExperimentalsMenu() {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {MENU_CONFIG.icon}
                {MENU_CONFIG.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DirectionMenu />
                <DirectoriesMenu />
                <SmoothScrollingMenu />
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { ExperimentalsMenu, MENU_CONFIG }
