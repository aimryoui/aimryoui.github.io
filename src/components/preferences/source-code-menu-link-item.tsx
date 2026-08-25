"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { CodeBoldDuotoneIcon } from "@solar-icons/react"

import { DropdownMenuLinkItem } from "@/components/ui/dropdown-menu"

const MENU_NAME = "Source code"

interface SourceCodeMenuConfig {
    href: string
    label: string
    description: string
    icon?: React.ReactNode
}

const SOURCE_CODE_MENU: SourceCodeMenuConfig = {
    href: "https://github.com/aimryoui/aimryoui.github.io",
    label: MENU_NAME,
    description: "View the source code of this website on GitHub.",
    icon: (
        <CodeBoldDuotoneIcon className="-translate-y-[.5px] [--solar-secondary-opacity:0.4]" />
    )
}

function SourceCodeMenuLinkItem() {
    return (
        <DropdownMenuLinkItem
            href={SOURCE_CODE_MENU.href}
            externalLink
            openInNewTab
            description={SOURCE_CODE_MENU.description}
            srOnlyDescription
            onClick={() => {
                sendGAEvent("event", "button_click", {
                    button_name: "Preferences - Source Code"
                })
            }}
        >
            {SOURCE_CODE_MENU.icon}
            {SOURCE_CODE_MENU.label}
        </DropdownMenuLinkItem>
    )
}

export { MENU_NAME, SOURCE_CODE_MENU, SourceCodeMenuLinkItem }
