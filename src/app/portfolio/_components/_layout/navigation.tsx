"use client"
import { Divider } from "@/components/layout/divider"
import { MarginLine } from "@/components/layout/line"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { MobileTocPanel } from "@/portfolio/_components/_layout/mobile-toc"
import Sidebar, { Menu } from "@/portfolio/_components/_layout/sidebar"

export function Navigation() {
    const isMobile = useMediaQuery("lg")

    if (isMobile) {
        return (
            <div
                className={cn("z-50", {
                    lg: "fixed inset-x-0 bottom-0"
                })}
            >
                <MobileTocPanel />
                <div
                    className={cn(
                        "relative z-50 min-h-20 w-full bg-background"
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
            <Sidebar />
            <MarginLine className={cn("ms-sidebar lg:hidden")} />
            <Divider
                dir="vertical"
                className={cn("sticky top-0 h-dvh lg:hidden")}
            />
            <MarginLine className={cn("lg:hidden")} />
        </>
    )
}
