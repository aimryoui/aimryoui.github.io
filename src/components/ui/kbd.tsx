import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
    return (
        <kbd
            data-slot="kbd"
            className={cn(
                "bg-stroke-foreground/60 text-muted-foreground font-icon pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 text-xs select-none dark:bg-stroke-foreground",
                "[&_svg:not([class*='size-'])]:size-3",
                "in-data-[slot=tooltip-content]:text-foreground in-data-[slot=tooltip-content]:bg-stroke-foreground in-data-[slot=tooltip-content]:translate-x-1",
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
