"use client"

import { useState, ViewTransition } from "react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { PanelTopClose, PanelTopOpen } from "lucide-react"

import { Ellipsis } from "@/components/icons/icons"
import { SectionLine } from "@/components/layout/line"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuLinkItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useTocItems } from "@/portfolio/_components/_layout/_toc/use-toc-items"
import { TableOfContents } from "@/portfolio/_components/_layout/table-of-contents"
import {
    type PortfolioMode,
    usePortfolioModeStore
} from "@/stores/portfolio-mode-store"
import { useTocPanelStore } from "@/stores/toc-panel-store"

import { projects } from "~/.velite"

function Sidebar({ className }: { className?: string }) {
    const mode = usePortfolioModeStore((state) => state.mode)
    const tocItems = useTocItems(mode)

    return (
        <ViewTransition name="sidebar">
            <aside
                className={cn(
                    "group/sidebar fixed left-[calc(var(--spacing)*6+var(--px))] top-0 z-20 flex h-dvh w-sidebar flex-col justify-end bg-background lg:hidden",
                    className
                )}
            >
                <TableOfContents mode={mode} items={tocItems} />
                <Menu />
            </aside>
        </ViewTransition>
    )
}

function Menu({ className }: { className?: string }) {
    const isMobile = useMediaQuery("lg")

    const router = useRouter()
    const pathname = usePathname()
    const mode = usePortfolioModeStore((state) => state.mode)
    const setMode = usePortfolioModeStore((state) => state.setMode)

    // Navigate back to the `/portfolio` page if mode is set to "spread"
    // and the current URL is not `/portfolio`
    const handleModeChange = (nextMode: PortfolioMode) => {
        setMode(nextMode)

        if (nextMode === "spread") {
            if (pathname !== "/portfolio") {
                router.push("/portfolio")
            }
        }
    }

    const [sidebarPostion, setSidebarPostion] = useState<"left" | "right">(
        "left"
    )
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const isTocOpen = useTocPanelStore((state) => state.isOpen)
    const toggleTocPanel = useTocPanelStore((state) => state.toggle)

    return (
        <>
            <div
                className="relative z-1 w-full"
                // style={{
                //     viewTransitionName: "progress-bar"
                // }}
            >
                <Progress />
                <SectionLine
                    fit
                    // style={{
                    //     viewTransitionName: "toc-divider-menu"
                    // }}
                />
            </div>
            <header
                className={cn("bg-background px-6 py-5.5", {
                    lg: "py-[17px]"
                })}
            >
                <menu
                    className={cn(
                        "flex items-center gap-2 @container",
                        {
                            lg: "gap-4"
                        },
                        className
                    )}
                >
                    <li className="me-auto">
                        <NextLink
                            href="/"
                            className={cn("group flex items-center gap-x-2", {
                                lg: "gap-x-4"
                            })}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className={cn(
                                    "size-9 will-change-transform transition-[transform,rotate] ease-spring duration-700 group-hover:rotate-180"
                                )}
                            >
                                <path
                                    className="fill-highlighted"
                                    filter="url(#logo)"
                                    d="M40.541 30.03c-3.115-.193-4.673-.29-5.248.671-.574.962.25 2.288 1.897 4.94l1.868 3.004c.964 1.551 1.446 2.327 1.243 3.093-.202.767-1.004 1.203-2.608 2.077l-3.994 2.174c-1.572.855-2.359 1.283-3.103 1.05-.745-.235-1.145-1.036-1.944-2.638l-1.595-3.196c-1.39-2.785-2.086-4.178-3.204-4.195-1.118-.016-1.854 1.356-3.325 4.1l-1.676 3.125c-.854 1.593-1.282 2.39-2.04 2.6-.757.209-1.533-.255-3.085-1.181L9.75 43.278c-1.552-.927-2.328-1.39-2.503-2.158-.174-.766.325-1.52 1.322-3.028l1.957-2.956c1.719-2.597 2.578-3.895 2.034-4.872-.545-.977-2.1-.928-5.213-.832l-3.552.11c-1.797.056-2.696.083-3.255-.464-.56-.548-.552-1.447-.535-3.245l.042-4.522c.017-1.815.026-2.722.603-3.26.576-.538 1.482-.484 3.294-.375l3.536.212c3.102.187 4.653.28 5.226-.68.573-.958-.245-2.28-1.88-4.923L8.965 9.273c-.955-1.544-1.432-2.316-1.232-3.079.2-.763.996-1.2 2.586-2.076l3.987-2.195c1.564-.86 2.346-1.291 3.09-1.062.745.229 1.15 1.024 1.96 2.616l1.62 3.186c1.402 2.754 2.102 4.13 3.216 4.142 1.114.012 1.843-1.35 3.302-4.073l1.64-3.063c.855-1.594 1.282-2.39 2.04-2.601.758-.21 1.534.254 3.087 1.181l3.974 2.374c1.552.928 2.329 1.391 2.503 2.158.175.767-.325 1.521-1.324 3.029l-1.919 2.896c-1.706 2.575-2.559 3.863-2.02 4.838.538.975 2.082.94 5.17.868l3.593-.083c1.777-.041 2.665-.062 3.22.482.553.544.55 1.433.541 3.21l-.021 4.577c-.008 1.826-.013 2.74-.591 3.28-.58.542-1.49.486-3.314.372l-3.53-.22Z"
                                />
                                <defs>
                                    <filter
                                        id="logo"
                                        colorInterpolationFilters="sRGB"
                                    >
                                        <feColorMatrix
                                            in="SourceAlpha"
                                            result="alpha"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                        />
                                        <feGaussianBlur stdDeviation="4.18" />
                                        <feComposite
                                            in2="alpha"
                                            operator="arithmetic"
                                            k2="-1"
                                            k3="1"
                                        />
                                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                                        <feBlend in2="SourceGraphic" />
                                    </filter>
                                </defs>
                            </svg>
                            <div
                                className={cn(
                                    "flex flex-col sm:@[19.75rem]:hidden"
                                )}
                            >
                                <Bold className="text-sm">
                                    <At className="text-current font-wght-[625]" />
                                    {siteConfig.username}
                                </Bold>
                                <p className="font-mono text-xs">
                                    {`${projects.length} PROJECTS`}
                                </p>
                            </div>
                        </NextLink>
                    </li>
                    <li>
                        <ModeToggle
                            className={cn({
                                lg: "size-[36px]"
                            })}
                        />
                    </li>
                    <li className="lg:me-2">
                        <DropdownMenu
                            onOpenChange={(open) => {
                                setIsSettingsOpen(open)
                            }}
                        >
                            <TooltipTrigger
                                delay={500}
                                disabled={isSettingsOpen}
                                payload={{
                                    content: <span>Settings</span>
                                }}
                                render={
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className={cn({
                                                    lg: "size-[36px]"
                                                })}
                                            />
                                        }
                                    >
                                        <Ellipsis className="size-6" />
                                        <span className="sr-only">
                                            Settings
                                        </span>
                                    </DropdownMenuTrigger>
                                }
                            />
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Settings
                                    </DropdownMenuLabel>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            View mode
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup
                                                value={mode}
                                                onValueChange={(value) => {
                                                    handleModeChange(
                                                        value as PortfolioMode
                                                    )
                                                }}
                                            >
                                                <DropdownMenuRadioItem
                                                    value="pages"
                                                    closeOnClick
                                                >
                                                    Pages
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem
                                                    value="spread"
                                                    closeOnClick
                                                >
                                                    Spread
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            Sidebar position
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup
                                                value={sidebarPostion}
                                                onValueChange={(value) => {
                                                    setSidebarPostion(
                                                        value as
                                                            | "left"
                                                            | "right"
                                                    )
                                                }}
                                            >
                                                <DropdownMenuRadioItem value="left">
                                                    Left
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="right">
                                                    Right
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>About</DropdownMenuLabel>
                                    <DropdownMenuLinkItem
                                        href="https://github.com/aimryoui/aimryoui.github.io"
                                        openInNewTab
                                    >
                                        Source code
                                    </DropdownMenuLinkItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>
                    {isMobile && (
                        <li className="-my-5.5 -me-6 size-20">
                            <TooltipTrigger
                                delay={500}
                                disabled={isTocOpen}
                                payload={{
                                    content: <span>Table of Contents</span>
                                }}
                                render={
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className={cn(
                                            "size-full rounded-none border-y-0 border-e-0"
                                        )}
                                        aria-expanded={isTocOpen}
                                        data-state={
                                            isTocOpen ? "open" : "closed"
                                        }
                                        onClick={toggleTocPanel}
                                    >
                                        {isTocOpen ? (
                                            <PanelTopOpen
                                                className="size-8"
                                                strokeWidth={1.25}
                                            />
                                        ) : (
                                            <PanelTopClose
                                                className="size-8"
                                                strokeWidth={1.25}
                                            />
                                        )}
                                        <span className="sr-only">
                                            Table of Contents
                                        </span>
                                    </Button>
                                }
                            />
                        </li>
                    )}
                </menu>
            </header>
        </>
    )
}

export default Sidebar
export { Menu }
