import { memo } from "react"

import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

const TocDivider = memo(({ className }: React.ComponentProps<"input">) => (
    // <ViewTransition name={`toc-divider-${id}`}>
    <li
        role="separator"
        className={cn(
            "my-3 h-px will-change-[opacity] first:hidden",
            className
        )}
    >
        <SectionLine fit />
    </li>
    // </ViewTransition>
))
TocDivider.displayName = "TocDivider"

export { TocDivider }
