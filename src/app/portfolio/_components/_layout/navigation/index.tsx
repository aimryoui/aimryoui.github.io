"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { Divider } from "@/components/layout/divider"
import { MarginLine } from "@/components/layout/line"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import Toolbar from "@/portfolio/_components/_layout/navigation/toolbar"
import { TableOfContents } from "@/portfolio/_components/_layout/toc"
import { useTocRevealStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"

function Navigation({ className, ...props }: React.ComponentProps<"aside">) {
    const isMobile = useMediaQuery("lg")
    const pathname = usePathname()
    const tocItems = useTocItems()

    useEffect(() => {
        // Mark TOC as revealed immediately after the initial mount cycle.
        // If TableOfContents mounts on Desktop, it will read the state BEFORE this runs.
        // If it mounts on Mobile, this ensures subsequent Desktop resizes don't animate.
        useTocRevealStore.getState().markTocRevealed()
    }, [])

    return (
        <>
            <aside
                className={cn(
                    "group/sidebar sticky start-[calc(var(--body-safe-zone-left)+var(--px))] top-0 z-65 order-1 flex h-dvh w-sidebar flex-col justify-end bg-background",
                    {
                        "group-data-[sidebar-position=inline-end]/html": [
                            "end-[calc(var(--body-safe-zone-right)+var(--px))] start-auto order-9",
                            {
                                lg: "inset-x-0 bottom-0 top-auto h-auto w-full"
                            }
                        ],
                        lg: "fixed inset-x-0 bottom-0 top-auto z-75 h-auto w-full"
                    },
                    className
                )}
                {...props}
            >
                {!isMobile && (
                    <TableOfContents
                        items={tocItems}
                        enableStartEndAutoHighlight={pathname === "/portfolio"}
                        className="lg:hidden"
                    />
                )}
                <Toolbar
                    items={tocItems}
                    enableStartEndAutoHighlight={pathname === "/portfolio"}
                />
            </aside>
            <MarginLine
                className={cn("order-2", {
                    "group-data-[sidebar-position=inline-end]/html": "order-8",
                    lg: "hidden"
                })}
            />
            <Divider
                dir="vertical"
                className={cn(
                    "sticky top-0 order-3 h-dvh lg:hidden",
                    "group-data-[sidebar-position=inline-end]/html:order-7"
                )}
            />
            <MarginLine
                className={cn(
                    "order-4 lg:hidden",
                    "group-data-[sidebar-position=inline-end]/html:order-6"
                )}
            />
        </>
    )
}

export default Navigation
