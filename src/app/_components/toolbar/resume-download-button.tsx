"use client"

import { ArrowUpRight } from "lucide-react"

import { LinkButton } from "@/components/ui/button"
import { getResumeUrl } from "@/configs/role.config"
import { useQueryStore } from "@/stores/query-store"

function ResumeDownloadButton() {
    const role = useQueryStore((s) => s.role)
    const resumeUrl = getResumeUrl(role)

    return (
        <LinkButton
            href={resumeUrl}
            variant="outline"
            className="pe-2 dark:bg-input/25"
            tracking={{
                eventName: "button_click",
                eventParams: {
                    button_name: `Toolbar - Download Resume (${role.toUpperCase()})`
                }
            }}
        >
            Resume
            <ArrowUpRight className="rtl:-scale-x-100" />
        </LinkButton>
    )
}

export { ResumeDownloadButton }
