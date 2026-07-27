"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import Toolbar from "@/portfolio/_components/_layout/navigation/toolbar"
import { TableOfContents } from "@/portfolio/_components/_layout/toc/toc"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
    const mode = usePortfolioModeStore((state) => state.mode)
    const tocItems = useTocItems(mode)

    return (
        // <ViewTransition name="sidebar">
        <aside
            className={cn(
                "group/sidebar fixed left-[calc(var(--spacing)*6+var(--px))] top-0 z-50 flex h-dvh w-sidebar flex-col justify-end bg-background",
                {
                    "group-data-[sidebar-position=right]/html":
                        "left-auto right-[calc(var(--spacing)*6+var(--px))]",
                    lg: "hidden"
                },
                className
            )}
            {...props}
        >
            <TableOfContents mode={mode} items={tocItems} />
            <Toolbar />
        </aside>
        // </ViewTransition>
    )
}

export default Sidebar
