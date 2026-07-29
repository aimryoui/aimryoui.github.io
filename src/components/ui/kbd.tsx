"use client"

import { Keyboard as KbdPrimitive } from "react-aria-components/Keyboard"

import { cn } from "@/lib/utils"

type KbdProps = React.ComponentProps<typeof KbdPrimitive>

function Kbd({ className, ...props }: KbdProps) {
    return (
        <KbdPrimitive
            data-slot="kbd"
            className={cn(
                "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-stroke/60 px-1.5 font-sans text-xs tracking-tight text-muted-foreground font-wght-[625]",
                "dark:bg-stroke [&_svg:not([class*='size-'])]:size-3",
                {
                    "in-data-[slot=tooltip-content]":
                        "translate-x-1 bg-stroke text-foreground"
                },
                className
            )}
            {...props}
        />
    )
}

function KbdGroup({ className, ...props }: KbdProps) {
    return (
        <KbdPrimitive
            data-slot="kbd-group"
            className={cn("inline-flex items-center gap-1", className)}
            {...props}
        />
    )
}

export type { KbdProps }
export { Kbd, KbdGroup }
