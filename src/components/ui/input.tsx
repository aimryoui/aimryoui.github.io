"use client"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 pb-1.5 pt-1 text-base caret-highlighted will-change-[outline,border]",
                {
                    hover: "bg-element-hover",
                    dark: "bg-input/30",
                    file: "inline-flex h-7 border-0 bg-transparent text-sm font-medium text-foreground",
                    placeholder: "text-muted-foreground",
                    disabled:
                        "pointer-events-none cursor-not-allowed opacity-50",
                    "focus-visible":
                        "animate-focus border-ring hover:bg-transparent",
                    "aria-invalid":
                        "border-destructive ring-destructive/20 dark:ring-destructive/40",

                    lg: "text-[16px]"
                },
                className
            )}
            {...props}
        />
    )
}

export { Input }
