import { memo } from "react"

import { type Variants } from "motion/react"
import * as m from "motion/react-m"

import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

const lineVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    }
}

const TocDivider = memo(({ className }: React.ComponentProps<"input">) => (
    // <ViewTransition name={`toc-divider-${id}`}>
    <m.li
        variants={lineVariants}
        role="separator"
        className={cn(
            "my-3 h-px will-change-[opacity] first:hidden",
            className
        )}
    >
        <SectionLine fit />
    </m.li>
    // </ViewTransition>
))
TocDivider.displayName = "TocDivider"

export { TocDivider }
