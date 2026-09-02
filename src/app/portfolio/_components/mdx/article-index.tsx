"use client"

import { Fragment, useEffect, useMemo, useRef, useState } from "react"

import { ListBoldDuotoneIcon } from "@solar-icons/react"
import { ChevronLeft, ChevronsUpDown } from "lucide-react"

import { ElementLine, MarginLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePreference } from "@/hooks/use-preference"
import { useWindowEvent } from "@/hooks/use-window-event"
import { cn } from "@/lib/utils"
import { TableOfContents } from "@/portfolio/_components/_layout/toc"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import { useArticleTocStore } from "@/portfolio/_components/mdx/stores/article-toc-store"

import { type Project } from "~/.velite"
import { BASE_FONT_SIZE } from "~/tailwind.config"

const SCROLL_THRESHOLD = 5 * BASE_FONT_SIZE // 5rem ~ var(--spacing-space) before md breakpoint
const SCROLL_OPTIONS = { passive: true }

const FPS = 20
const FPS_INTERVAL = 1000 / FPS

export interface Heading {
    id: string
    text: string
    level: 1 | 2
}

interface ArticleIndexProps {
    toc: Heading[]
    project: Project
}

function ArticleIndex({ toc, project }: ArticleIndexProps) {
    const isTocOpen = useArticleTocStore((s) => s.isTocOpen)
    const setIsTocOpen = useArticleTocStore((s) => s.setIsTocOpen)

    const items = useMemo<TocItemProps[]>(
        () =>
            toc.map((h) => ({
                id: h.id,
                label: h.text,
                depth: h.level === 1 ? 2 : 3,
                mode: "anchor" as const,
                kind: "static" as const
            })),
        [toc]
    )

    const [isExpanded, setIsExpanded] = useState(false)

    const { sidebarPosition } = usePreference()
    const sidebarPositionInlineStart = sidebarPosition === "inline-start"

    const isOnePointFiveXl = useMediaQuery("1.5xl")
    const isLg = useMediaQuery("lg")

    const DrawerComp = isOnePointFiveXl ? Drawer : Fragment
    const DrawerTriggerComp = isOnePointFiveXl ? DrawerTrigger : Fragment
    const DrawerContentComp = isOnePointFiveXl ? DrawerContent : Fragment

    const throttleTimeoutRef = useRef<NodeJS.Timeout>(undefined)

    useWindowEvent(
        "scroll",
        () => {
            // Stop listening when scrolling past viewport (first 100dvh)
            if (window.scrollY > window.innerHeight) return

            if (throttleTimeoutRef.current) return
            throttleTimeoutRef.current = setTimeout(() => {
                throttleTimeoutRef.current = undefined
                if (window.scrollY <= SCROLL_THRESHOLD) {
                    setIsExpanded(false)
                }
            }, FPS_INTERVAL)
        },
        SCROLL_OPTIONS
    )

    useEffect(() => {
        return () => {
            clearTimeout(throttleTimeoutRef.current)
        }
    }, [])

    return (
        <DrawerComp
            {...(isOnePointFiveXl && {
                open: isTocOpen,
                onOpenChange: setIsTocOpen,
                swipeDirection: isLg
                    ? sidebarPositionInlineStart
                        ? "left"
                        : "right"
                    : sidebarPositionInlineStart
                      ? "right"
                      : "left",
                showSwipeHandle: false,
                keepMounted: true
            })}
        >
            <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-end">
                <Space
                    className={cn(
                        "pointer-events-none sticky bottom-0 z-[64] hidden w-[100cqw] items-center justify-end bg-transparent",
                        {
                            "group-data-[sidebar-position=inline-end]/html":
                                "justify-start",
                            "1.5xl": "flex",
                            lg: "bottom-[--toolbar-height] top-auto justify-start",
                            md: "bottom-[calc(var(--toolbar-height)+var(--spacing)*10+var(--px)/2)]"
                        }
                    )}
                >
                    {isOnePointFiveXl ? (
                        <DrawerTriggerComp render={<TriggerButton />} />
                    ) : (
                        <TriggerButton />
                    )}
                </Space>
            </div>
            <DrawerContentComp
                {...(isOnePointFiveXl && {
                    className: cn(
                        "w-[calc(var(--spacing-sidebar)+var(--spacing-safe-zone)+var(--px))] flex-row sm:w-[calc(100dvw-var(--spacing-space)+var(--px))] [&>div>*]:!flex"
                    )
                })}
            >
                <MarginLine
                    className={cn("absolute inset-y-0 start-0 z-60 hidden", {
                        webkit: "absolute h-full",
                        "group-data-[sidebar-position=inline-end]/html":
                            "end-0 start-auto order-last",
                        "1.5xl": "hidden",
                        lg: "end-0 start-auto order-last"
                    })}
                />
                <aside
                    className={cn(
                        "pointer-events-auto sticky end-[calc(var(--body-safe-zone-left)+var(--px))] top-0 z-[56] order-9 flex h-dvh w-sidebar shrink-0 flex-col overscroll-contain bg-background",
                        {
                            "group-data-[sidebar-position=inline-end]/html":
                                "end-auto start-[calc(var(--body-safe-zone-left)+var(--px))] order-1",
                            "1.5xl":
                                "end-auto hidden w-[calc(var(--spacing-sidebar)+var(--spacing-safe-zone)+var(--px))]",
                            lg: "h-[calc(100dvh-var(--toolbar-height))]",
                            sm: "w-[calc(100dvw-var(--spacing-space)+var(--px))]"
                        }
                    )}
                >
                    <Space className="sticky top-0 z-90 -mt-space flex shrink-0 flex-col items-center">
                        <Bold
                            mono
                            className="flex w-full flex-1 items-center justify-start px-safe-zone text-sm uppercase text-muted-foreground"
                        >
                            In this article
                        </Bold>
                        <ElementLine dir="horizontal" />
                    </Space>
                    <div className="sticky top-0 -mt-space flex min-h-0 w-full flex-1 flex-col pt-space">
                        <div className="flex min-h-0 flex-1 flex-col">
                            <TableOfContents
                                items={items}
                                showSearch={false}
                                compact={!isLg}
                                labelElement="span"
                                lineSidebarEffect={!isLg}
                                enableStartEndAutoHighlight
                                className="lg:text-xl"
                                onItemPress={() => {
                                    setIsTocOpen(false)
                                }}
                            />
                        </div>
                        <ElementLine dir="horizontal" />
                        <Space
                            aria-hidden={true}
                            className="flex shrink-0 items-center px-safe-zone"
                        >
                            <Bold
                                mono
                                className="text-sm uppercase text-muted-foreground"
                            >
                                In this article
                            </Bold>
                        </Space>
                    </div>
                    <Space
                        className={cn(
                            "pointer-events-auto sticky top-[calc(100dvh-var(--spacing-space))] flex h-fit min-h-space w-full items-end bg-background"
                        )}
                    >
                        <span
                            className={cn(
                                "sr-only absolute bottom-full start-0 max-w-[calc(100%-var(--spacing-safe-zone)*2)] px-safe-zone pb-4 font-mono text-sm uppercase leading-normal"
                            )}
                        >
                            You&#39;re viewing
                        </span>
                        {project.detail ? (
                            <Collapsible
                                isExpanded={isExpanded}
                                onExpandedChange={setIsExpanded}
                                className={cn(
                                    "relative flex w-full flex-col bg-background"
                                )}
                            >
                                <ElementLine
                                    dir="horizontal"
                                    containerClassName="absolute inset-x-0 top-0"
                                />
                                <CollapsibleTrigger
                                    pressSound={
                                        isExpanded ? "zoom-out" : "zoom-in"
                                    }
                                    className={cn(
                                        "flex h-space items-center justify-start gap-safe-zone px-safe-zone py-safe-zone-vertical transition-[background-color] duration-100",
                                        "group-has-[input:not(:placeholder-shown)]/sidebar:hidden",
                                        {
                                            hover: "bg-muted/45 transition-none",
                                            active: "bg-muted/60 transition-none",
                                            "group-data-expanded/collapsible":
                                                "bg-muted/20 hover:bg-muted/45 active:bg-muted/60 dark:bg-muted/30"
                                        }
                                    )}
                                >
                                    <div className="flex min-w-0 flex-1 flex-col items-start">
                                        <Bold
                                            title={project.name}
                                            className={cn(
                                                "max-w-full -translate-y-0.75 truncate text-xl",
                                                {
                                                    "group-active/collapsible-trigger":
                                                        "text-highlighted",
                                                    "group-data-expanded/collapsible":
                                                        "text-highlighted",

                                                    md: "-translate-y-0.5"
                                                }
                                            )}
                                        >
                                            {project.name}
                                        </Bold>
                                        <Bold
                                            title={project.category}
                                            className={cn(
                                                "max-w-full truncate text-nowrap text-sm leading-4 text-muted-foreground/70 font-wght-550",
                                                {
                                                    "group-hover/collapsible-trigger":
                                                        "text-muted-foreground",
                                                    "group-active/collapsible-trigger":
                                                        "text-foreground",
                                                    "group-data-expanded/collapsible":
                                                        "text-foreground",

                                                    md: "translate-y-0.25 text-xs"
                                                }
                                            )}
                                        >
                                            {project.category}
                                        </Bold>
                                    </div>
                                    <ChevronsUpDown className="size-5 shrink-0 text-muted-foreground group-hover/collapsible-trigger:text-foreground group-data-expanded/collapsible:text-foreground" />
                                </CollapsibleTrigger>
                                <SectionLine fit />
                                <CollapsibleContent>
                                    <div
                                        className={cn(
                                            "space-y-2.5 text-pretty px-safe-zone py-safe-zone-vertical"
                                        )}
                                    >
                                        <Text
                                            className={cn(
                                                "text-pretty text-sm text-foreground font-wght-550"
                                            )}
                                        >
                                            {formatOrdinals(
                                                project.detail.description
                                            )}
                                        </Text>
                                        {project.detail.abbreviation && (
                                            <Text
                                                className={cn(
                                                    "text-pretty text-sm text-muted-foreground"
                                                )}
                                            >
                                                {formatOrdinals(
                                                    project.detail.abbreviation
                                                )}
                                            </Text>
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <>
                                <ElementLine
                                    dir="horizontal"
                                    containerClassName="absolute inset-x-0 top-0"
                                />
                                <div className="flex min-w-0 flex-1 flex-col items-start px-safe-zone py-safe-zone-vertical">
                                    <Bold
                                        title={project.name}
                                        className={cn(
                                            "max-w-full -translate-y-0.75 truncate text-xl",
                                            {
                                                md: "-translate-y-0.5"
                                            }
                                        )}
                                    >
                                        {project.name}
                                    </Bold>
                                    <Bold
                                        title={project.category}
                                        className={cn(
                                            "max-w-full truncate text-nowrap text-sm leading-4 text-muted-foreground/70 font-wght-550",
                                            {
                                                md: "translate-y-0.25 text-xs"
                                            }
                                        )}
                                    >
                                        {project.category}
                                    </Bold>
                                </div>
                            </>
                        )}
                    </Space>
                </aside>
            </DrawerContentComp>
        </DrawerComp>
    )
}

function TriggerButton({ className, ...props }: ButtonProps) {
    return (
        <Button
            data-cursor="ignore"
            variant="outline"
            className={cn(
                "pointer-events-auto rounded-e-none border-e-transparent pe-3.25 ps-2",
                {
                    hover: "pe-5",
                    "group-data-[sidebar-position=inline-end]/html": [
                        "rounded-e-xlg rounded-s-none border-e-stroke border-s-transparent pe-2 ps-3.25",
                        {
                            hover: "pe-2 ps-5"
                        }
                    ],
                    "1.5xl": "shadow-md shadow-background/40",
                    lg: [
                        "h-9.5 rounded-e-full rounded-s-none border-e-stroke border-s-transparent pe-2 ps-3.25 !corner-round",
                        {
                            hover: "pe-2 ps-5"
                        }
                    ],
                    md: "-ms-[calc(var(--spacing-safe-zone)+var(--px))] ps-safe-zone"
                },
                className
            )}
            {...props}
        >
            <ListBoldDuotoneIcon className="hidden size-5 sm:block rtl:-scale-x-100" />
            <ChevronLeft
                className={cn("size-4.5", {
                    rtl: "rotate-180",
                    "group-data-[sidebar-position=inline-end]/html":
                        "order-last rotate-180 rtl:rotate-0",
                    lg: "order-last rotate-180 rtl:rotate-0",
                    sm: "size-5 stroke-1.5"
                })}
            />
            <span className={cn("sm:hidden")}>In this Article</span>
        </Button>
    )
}

export { ArticleIndex }
