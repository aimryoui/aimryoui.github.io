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
            className="dark:bg-input/25"
        >
            Resume
            <ArrowUpRight className="-me-1 rtl:-scale-x-100" />
        </LinkButton>
    )
}

export { ResumeDownloadButton }
