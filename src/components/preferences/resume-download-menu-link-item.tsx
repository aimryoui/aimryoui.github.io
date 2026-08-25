"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { FileDownloadBoldDuotoneIcon } from "@solar-icons/react"

import { DropdownMenuLinkItem } from "@/components/ui/dropdown-menu"
import { getResumeUrl } from "@/configs/role.config"
import { useQueryStore } from "@/stores/query-store"

const MENU_NAME = "Resume"

interface ResumeMenuConfig {
    label: string
    description: string
    icon?: React.ReactNode
}

const RESUME_DOWNLOAD_MENU: ResumeMenuConfig = {
    label: MENU_NAME,
    description: "Download my resume.",
    icon: <FileDownloadBoldDuotoneIcon />
}

function ResumeDownloadMenuLinkItem() {
    const role = useQueryStore((s) => s.role)
    const href = getResumeUrl(role)

    return (
        <DropdownMenuLinkItem
            href={href}
            openInNewTab
            description={RESUME_DOWNLOAD_MENU.description}
            srOnlyDescription
            onClick={() => {
                sendGAEvent("event", "button_click", {
                    button_name: `Preferences - Download Resume (${role.toUpperCase()})`
                })
            }}
        >
            {RESUME_DOWNLOAD_MENU.icon}
            {RESUME_DOWNLOAD_MENU.label}
        </DropdownMenuLinkItem>
    )
}

export { MENU_NAME, RESUME_DOWNLOAD_MENU, ResumeDownloadMenuLinkItem }
