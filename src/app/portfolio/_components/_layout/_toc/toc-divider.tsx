import { memo } from "react"

import { type Variants } from "motion/react"
import m from "motion/react-m"

import { SectionLine } from "@/components/layout/line"

const lineVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    }
}

const TocDivider = memo(() => (
    <m.li
        variants={lineVariants}
        className="my-3 h-px will-change-[opacity] first:hidden"
    >
        <SectionLine fit />
    </m.li>
))
TocDivider.displayName = "TocDivider"

export { TocDivider }
