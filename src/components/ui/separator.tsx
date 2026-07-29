"use client"

import { Separator as SeparatorPrimitive } from "react-aria-components"

import { cn } from "@/lib/utils"

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive>

function Separator({
    className,
    orientation = "horizontal",
    ...props
}: SeparatorProps) {
    return (
        <SeparatorPrimitive
            data-slot="separator"
            orientation={orientation}
            className={cn(
                "block shrink-0 border-0 bg-border",
                {
                    "aria-[orientation=horizontal]": "h-px w-full",
                    "aria-[orientation=vertical]": "w-px self-stretch",
                    "is-[hr]": "h-px w-full"
                },
                className
            )}
            {...props}
        />
    )
}

export type { SeparatorProps }
export { Separator }
