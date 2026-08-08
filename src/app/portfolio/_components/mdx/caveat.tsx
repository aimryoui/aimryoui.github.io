import { FileExclamationPoint } from "lucide-react"

import { Note } from "@/components/layout/note"
import { cn } from "@/lib/utils"

function CaveatLightness() {
    return (
        <Note
            className={cn("flex flex-col items-start justify-start text-start")}
        >
            <div className="mb-0.5 flex items-center gap-1 self-start">
                <FileExclamationPoint className="size-4 -translate-y-0.25" />
                <strong>Caveat:</strong>
            </div>
            <span>
                This project has some <strong>high brightness</strong> media,
                which will be <strong>dimmed</strong> on dark mode.{" "}
                <strong>Opt-out</strong> by turning off the{" "}
                <code>Media &gt; Dim white point</code> preference or press on
                the media to go into its <code>Lightbox</code> mode.
            </span>
        </Note>
    )
}

export { CaveatLightness }
