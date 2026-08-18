"use client"

import { cn } from "@/lib/utils"

type ScrollAreaProps = React.ComponentProps<"div">

function ScrollArea({ className, ...props }: ScrollAreaProps) {
    return (
        <div
            data-slot="scroll-area"
            className={cn(
                "relative overflow-auto overscroll-contain outline-none scrollbar-thin",
                {
                    "focus-visible": "ring-3 ring-ring/50 outline-1"
                },
                className
            )}
            {...props}
        />
    )
}

export type { ScrollAreaProps }
export { ScrollArea }
