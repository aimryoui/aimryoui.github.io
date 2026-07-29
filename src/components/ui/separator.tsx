"use client"

import { Separator as SeparatorPrimitive } from "react-aria-components"

import { cn } from "@/lib/utils"

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive> & {
    dashed?: boolean
}

function Separator({
    className,
    orientation = "horizontal",
    dashed = true,
    ...props
}: SeparatorProps & React.ComponentProps<"svg">) {
    return orientation === "horizontal" ? (
        <div className={cn("pointer-events-none relative h-0 w-full")}>
            <SeparatorPrimitive
                data-slot="separator"
                orientation={orientation}
                className={cn(
                    "absolute left-1/2 top-1/2 block w-full shrink-0 -translate-x-1/2 -translate-y-1/2 border-b border-stroke",
                    dashed && "border-dashed",
                    className
                )}
                {...props}
            />
        </div>
    ) : (
        <div className={cn("pointer-events-none relative z-1 h-full")}>
            <svg
                data-slot="separator"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                role="separator"
                aria-orientation={orientation}
                className={cn(
                    "absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2",
                    className
                )}
                {...props}
            >
                <line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    className="stroke-stroke stroke-px stroke-dashed"
                />
            </svg>
        </div>
    )
}

export type { SeparatorProps }
export { Separator }
