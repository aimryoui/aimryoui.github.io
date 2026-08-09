"use client"

import { FileExclamationPoint } from "lucide-react"

import { Note } from "@/components/layout/note"
import {
    MEDIA_PREFERENCES,
    MENU_NAME
} from "@/components/preferences/media-menu"
import { cn } from "@/lib/utils"

function CaveatLightness() {
    return (
        <Note
            className={cn("flex flex-col items-start justify-start text-start")}
        >
            <div className="mb-0.5 flex items-center gap-1 self-start">
                <FileExclamationPoint className="size-4.5 -translate-y-0.25" />
                <strong>Caveat:</strong>
            </div>
            <span>
                This project has some <strong>high brightness</strong> media,
                which will be <strong>dimmed</strong> on dark mode.{" "}
                <strong>Opt-out</strong> by turning off the{" "}
                <code>
                    {MENU_NAME} &gt; {MEDIA_PREFERENCES.dim.label}
                </code>{" "}
                preference or press on the media to go into its{" "}
                <code>Lightbox</code> mode with original colors.
            </span>
        </Note>
    )
}

export { CaveatLightness }
