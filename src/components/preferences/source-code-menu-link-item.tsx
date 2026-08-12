import { CodeXml } from "lucide-react"

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
    icon: <CodeXml className="-translate-y-[.5px]" />
}

function SourceCodeMenuLinkItem() {
    return (
        <DropdownMenuLinkItem
            href={SOURCE_CODE_MENU.href}
            openInNewTab
            description={SOURCE_CODE_MENU.description}
            srOnlyDescription
        >
            {SOURCE_CODE_MENU.icon}
            {SOURCE_CODE_MENU.label}
        </DropdownMenuLinkItem>
    )
}

export { MENU_NAME, SOURCE_CODE_MENU, SourceCodeMenuLinkItem }
