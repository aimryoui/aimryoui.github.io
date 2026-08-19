"use client"

import { FlaskConical } from "lucide-react"

import { DirectionMenu } from "@/components/preferences/direction-menu"
import {
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

const MENU_CONFIG = {
    name: "Experimentals",
    icon: FlaskConical
}

function ExperimentalsMenu() {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <MENU_CONFIG.icon />
                {MENU_CONFIG.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DirectionMenu />
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { ExperimentalsMenu, MENU_CONFIG }
