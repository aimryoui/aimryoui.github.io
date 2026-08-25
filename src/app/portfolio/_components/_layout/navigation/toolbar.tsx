"use client"

import { RouteProgress } from "@/components/animations/route-progress"
import { AudioToggle } from "@/components/audio/audio"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import { ModeToggle } from "@/components/layout/toolbar/mode-toggle"
import { Tooltip } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { LogoLink } from "@/portfolio/_components/_layout/navigation/logo"
import { MobileTocButton } from "@/portfolio/_components/_layout/toc/mobile"
import { PreferencesButton } from "@/portfolio/_components/_layout/toolbar/preferences-button"

function Toolbar({ className }: { className?: string }) {
    const isMobile = useMediaQuery("lg", true)

    return (
        <>
            <div
                className="relative z-1 w-full"
                // style={{
                //     viewTransitionName: "progress-bar"
                // }}
            >
                <RouteProgress />
                <SectionLine
                    fit
                    // style={{
                    //     viewTransitionName: "toc-divider-menu"
                    // }}
                />
            </div>
            <header
                className={cn(
                    "flex h-space min-w-body items-center bg-background px-safe-zone",
                    {
                        lg: "py-3.5"
                    }
                )}
            >
                <menu
                    className={cn(
                        "flex w-full items-center gap-3 @container",
                        {
                            lg: "gap-safe-zone"
                        },
                        className
                    )}
                >
                    <Tooltip>
                        <li className="me-auto">
                            <LogoLink />
                        </li>
                        <li>
                            <AudioToggle />
                        </li>
                        <li>
                            <ModeToggle />
                        </li>
                        <li>
                            <PreferencesButton />
                        </li>
                        {isMobile && (
                            <li
                                className={cn(
                                    "relative -my-5.5 -me-safe-zone ms-0.25 hidden size-space",
                                    {
                                        lg: "block"
                                    }
                                )}
                            >
                                <SvgElementLine className="absolute inset-y-0 start-0 z-1 w-px" />
                                <MobileTocButton />
                            </li>
                        )}
                    </Tooltip>
                </menu>
            </header>
        </>
    )
}

export default Toolbar
