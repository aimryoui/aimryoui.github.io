import { FileDown } from "lucide-react"

import { DropdownMenuLinkItem } from "@/components/ui/dropdown-menu"

const MENU_NAME = "Resume"

interface SourceCodeMenuConfig {
    href: string
    label: string
    description: string
    icon?: React.ReactNode
}

const RESUME_DOWNLOAD_MENU: SourceCodeMenuConfig = {
    href: "/Resume_Product-Designer_Nguyen-Hoang-Nhan.pdf",
    label: MENU_NAME,
    description: "Download my resume.",
    icon: <FileDown className="-translate-y-[.5px]" />
}

function ResumeDownloadMenuLinkItem() {
    return (
        <DropdownMenuLinkItem
            href={RESUME_DOWNLOAD_MENU.href}
            openInNewTab
            description={RESUME_DOWNLOAD_MENU.description}
            srOnlyDescription
        >
            {RESUME_DOWNLOAD_MENU.icon}
            {RESUME_DOWNLOAD_MENU.label}
        </DropdownMenuLinkItem>
    )
}

export { MENU_NAME, RESUME_DOWNLOAD_MENU, ResumeDownloadMenuLinkItem }
