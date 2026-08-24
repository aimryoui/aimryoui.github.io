"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { FileDownloadBoldDuotoneIcon } from "@solar-icons/react"

import { DropdownMenuLinkItem } from "@/components/ui/dropdown-menu"
import { useQueryStore } from "@/stores/query-store"

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
    icon: <FileDownloadBoldDuotoneIcon />
}

function ResumeDownloadMenuLinkItem() {
    const role = useQueryStore((s) => s.role)
    const href =
        role === "cd"
            ? "/Resume_Creative-Designer_Nguyen-Hoang-Nhan.pdf"
            : RESUME_DOWNLOAD_MENU.href

    return (
        <DropdownMenuLinkItem
            href={href}
            openInNewTab
            description={RESUME_DOWNLOAD_MENU.description}
            srOnlyDescription
            onClick={() => {
                sendGAEvent("event", "button_click", {
                    button_name: "Preferences - Download Resume"
                })
            }}
        >
            {RESUME_DOWNLOAD_MENU.icon}
            {RESUME_DOWNLOAD_MENU.label}
        </DropdownMenuLinkItem>
    )
}

export { MENU_NAME, RESUME_DOWNLOAD_MENU, ResumeDownloadMenuLinkItem }
