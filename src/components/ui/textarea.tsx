"use client"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm field-content outline-none transition-[color,box-shadow] dark:bg-input/30",
                {
                    placeholder: "text-muted-foreground",
                    "focus-visible": "border-ring ring-[3px] ring-ring/50",
                    "aria-invalid":
                        "border-destructive ring-destructive/20 dark:ring-destructive/40",
                    disabled: "cursor-not-allowed opacity-50",
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
