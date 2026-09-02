"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { ChevronsUpDown } from "lucide-react"

import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { useWindowEvent } from "@/hooks/use-window-event"
import { cn } from "@/lib/utils"
import { TableOfContents } from "@/portfolio/_components/_layout/toc"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"

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
        <aside
            className={cn(
                "sticky end-[calc(var(--body-safe-zone-left)+var(--px))] top-0 z-[56] order-9 flex h-dvh w-sidebar shrink-0 flex-col overscroll-contain bg-background",
                {
                    "group-data-[sidebar-position=inline-end]/html":
                        "end-auto start-[calc(var(--body-safe-zone-left)+var(--px))] order-1",
                    xl: "hidden"
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
                        compact
                        labelElement="span"
                        enableStartEndAutoHighlight
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
                            pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                            className={cn(
                                "flex items-center justify-start gap-safe-zone px-safe-zone py-safe-zone-vertical transition-[background-color] duration-100",
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
                                                "text-highlighted"
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
                                                "text-foreground"
                                        }
                                    )}
                                >
                                    {project.category}
                                </Bold>
                            </div>
                            <ChevronsUpDown className="size-5 shrink-0 group-hover/collapsible-trigger:text-foreground group-data-expanded/collapsible:text-foreground" />
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
                                    {formatOrdinals(project.detail.description)}
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
                                    "max-w-full -translate-y-0.75 truncate text-xl"
                                )}
                            >
                                {project.name}
                            </Bold>
                            <Bold
                                title={project.category}
                                className={cn(
                                    "max-w-full truncate text-nowrap text-sm leading-4 text-muted-foreground/70 font-wght-550"
                                )}
                            >
                                {project.category}
                            </Bold>
                        </div>
                    </>
                )}
            </Space>
        </aside>
    )
}

export { ArticleIndex }
