import { memo } from "react"

import { SectionLine, type SectionLineProps } from "@/components/layout/line"
import { cn } from "@/lib/utils"

const TocDivider = memo(
    ({ containerClassName, ...props }: SectionLineProps) => (
        // <ViewTransition name={`toc-divider-${id}`}>
        <SectionLine
            fit
            containerClassName={cn("py-3 first:hidden", containerClassName)}
            {...props}
        />
        // </ViewTransition>
    )
)
TocDivider.displayName = "TocDivider"

export { TocDivider }
