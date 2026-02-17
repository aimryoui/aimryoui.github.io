"use client"

import { cn } from "@/lib/utils"

export function Masonry({ children, className }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("grid-lanes w-full gap-2 md:grid-cols-1", className)}
        >
            {children}
        </div>
    )
}
