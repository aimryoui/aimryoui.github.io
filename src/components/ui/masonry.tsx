"use client"

import { useEffect, useRef } from "react"

import { apply, supportsGridLanes } from "@/lib/grid-lanes-polyfill"
import { cn } from "@/lib/utils"

export function Masonry({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) {
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!gridRef.current || supportsGridLanes()) return

        console.log("🛣️ Grid Lanes Polyfill loaded")

        const layout = apply(gridRef.current)

        return () => {
            layout?.destroy()
        }
    }, [])

    return (
        <div
            ref={gridRef}
            data-slot="masonry"
            className={cn("w-full gap-2 grid-lanes md:grid-cols-1", className)}
            data-grid-lanes-polyfilled
            {...props}
        >
            {children}
        </div>
    )
}
