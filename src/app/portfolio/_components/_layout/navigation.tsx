"use client"

import { Divider } from "@/components/layout/divider"
import { MarginLine } from "@/components/layout/line"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import Sidebar, { Menu } from "@/portfolio/_components/_layout/sidebar"

export function Navigation() {
    const isMobile = useMediaQuery("lg")

    if (isMobile) {
        return (
            <div
                className={cn("pointer-events-none z-70", {
                    lg: "fixed inset-x-0 bottom-0"
                })}
            >
                <div
                    className={cn(
                        "pointer-events-auto relative min-h-20 w-full bg-background"
                    )}
                    style={{
                        viewTransitionName: "toolbar"
                    }}
                >
                    <Menu />
                </div>
            </div>
        )
    }

    return (
        <>
            <Sidebar
                className={cn(
                    "group-data-[sidebar-position=right]/html:order-4"
                )}
            />
            <MarginLine
                className={cn("ms-sidebar", {
                    "group-data-[sidebar-position=right]/html":
                        "z-60 order-3 me-sidebar ms-unset",
                    lg: "hidden"
                })}
            />
            <Divider
                dir="vertical"
                className={cn(
                    "sticky top-0 h-dvh lg:hidden",
                    "group-data-[sidebar-position=right]/html:order-2"
                )}
            />
            <MarginLine
                className={cn(
                    "lg:hidden",
                    "group-data-[sidebar-position=right]/html:order-1"
                )}
            />
        </>
    )
}
