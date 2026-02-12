import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
    return (
        <kbd
            data-slot="kbd"
            className={cn(
                "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-stroke/60 px-1.5 font-icon text-xs tracking-tight text-muted-foreground dark:bg-stroke",
                "[&_svg:not([class*='size-'])]:size-3",
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

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <kbd
            data-slot="kbd-group"
            className={cn("inline-flex items-center gap-1", className)}
            {...props}
        />
    )
}

export { Kbd, KbdGroup }
