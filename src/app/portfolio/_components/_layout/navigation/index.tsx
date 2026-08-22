"use client"

import { useEffect } from "react"

import { Divider } from "@/components/layout/divider"
import { MarginLine } from "@/components/layout/line"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import Toolbar from "@/portfolio/_components/_layout/navigation/toolbar"
import {
    markTocRevealed,
    TableOfContents
} from "@/portfolio/_components/_layout/toc/toc"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"

function Navigation({ className, ...props }: React.ComponentProps<"aside">) {
    const isMobile = useMediaQuery("lg")
    const tocItems = useTocItems()

    useEffect(() => {
        // Mark TOC as revealed immediately after the initial mount cycle.
        // If TableOfContents mounts on Desktop, it will read the state BEFORE this runs.
        // If it mounts on Mobile, this ensures subsequent Desktop resizes don't animate.
        markTocRevealed()
    }, [])

    return (
        <>
            <aside
                className={cn(
                    "group/sidebar fixed start-[calc(var(--spacing)*6+var(--px))] top-0 z-70 flex h-dvh w-sidebar flex-col justify-end bg-background",
                    {
                        "group-data-[sidebar-position=inline-end]/html": [
                            "end-[calc(var(--spacing)*6+var(--px))] start-auto order-4",
                            {
                                lg: "inset-x-0 bottom-0 top-auto h-auto w-full"
                            }
                        ],
                        lg: "inset-x-0 bottom-0 top-auto h-auto w-full"
                    },
                    className
                )}
                {...props}
            >
                {!isMobile && <TableOfContents items={tocItems} />}
                <Toolbar />
            </aside>
            <MarginLine
                className={cn("ms-sidebar", {
                    "group-data-[sidebar-position=inline-end]/html":
                        "z-60 order-3 me-sidebar ms-unset",
                    lg: "hidden"
                })}
            />
            <Divider
                dir="vertical"
                className={cn(
                    "sticky top-0 h-dvh lg:hidden",
                    "group-data-[sidebar-position=inline-end]/html:order-2"
                )}
            />
            <MarginLine
                className={cn(
                    "lg:hidden",
                    "group-data-[sidebar-position=inline-end]/html:order-1"
                )}
            />
        </>
    )
}

export default Navigation
