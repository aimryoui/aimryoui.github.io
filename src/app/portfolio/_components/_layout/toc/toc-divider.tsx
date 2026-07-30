import { memo } from "react"

import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

const TocDivider = memo(({ className }: React.ComponentProps<"div">) => (
    // <ViewTransition name={`toc-divider-${id}`}>
    <div role="separator" className={cn("my-3 h-px first:hidden", className)}>
        <SectionLine fit />
    </div>
    // </ViewTransition>
))
TocDivider.displayName = "TocDivider"

export { TocDivider }
