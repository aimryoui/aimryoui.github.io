"use client"

import { memo } from "react"

import { ChevronDown } from "lucide-react"

import { ArrowRight, ArrowUp } from "@/components/icons/icons"
import { Button, LinkButton } from "@/components/ui/button"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { highlightQuery } from "@/helpers/highlight-query"
import { isSameUrl } from "@/helpers/is-same-url"
import { cn } from "@/lib/utils"
import { useTocActiveId } from "@/portfolio/_hooks/use-toc-scroll"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocItemProps {
    id: string
    label: string
    depth: number
    href?: string
    mode?: "anchor" | "route"
    kind?: "static" | "project"
    icon?: React.ReactNode
    hidden?: boolean
}

interface TocItemRowProps {
    mode: PortfolioMode
    item: TocItemProps
    query?: string
    onPress: (item: TocItemProps) => void
    onSameLinkClick: () => void
    isCollapsed?: boolean
    onToggle?: () => void
}

const TocItemRow = memo(
    ({
        mode,
        item,
        query,
        onPress,
        onSameLinkClick,
        isCollapsed,
        onToggle
    }: TocItemRowProps) => {
        const isActive = useTocActiveId((s) => s.activeId === item.id)
        const href = item.href ?? `#${item.id}`

        const isProject = item.depth === 3 && !item.icon
        const isCategory = !isProject && !item.icon
        const isAnchor = !isProject && !!item.icon

        const isCollapsible = item.depth === 2 && item.id !== "outlines"

        const Comp = isProject ? "li" : "div"

        return (
            // <ViewTransition key={item.id} name={`toc-item-${item.id}`}>
            <Comp
                data-toc-item
                className={cn(
                    "relative box-content flex h-fit list-inside items-center",
                    {
                        // Tick
                        after: [
                            "absolute left-6 top-[calc(100%+var(--item-gap)/2)] h-px origin-left -translate-y-1/2 bg-[--marker-color] opacity-60",
                            "last:hidden has-[+[role=separator]]:hidden",
                            isProject
                                ? "w-[calc(var(--marker-length)*var(--tick-scale))] scale-x-[calc(1+var(--effect,0)*1.5)]"
                                : "w-1.25 scale-x-[--effect,0]"
                        ]
                    }
                )}
            >
                {/* Marker */}
                <span
                    aria-hidden={true}
                    className={cn(
                        "absolute left-6 top-1/2 h-px origin-left -translate-y-1/2",
                        isActive
                            ? "bg-highlighted"
                            : "bg-[color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--marker-color))]",
                        isProject
                            ? "w-[--marker-length] scale-x-[calc(1+var(--effect,0))]"
                            : "w-2.5 scale-x-[--effect,0]"
                    )}
                />
                <LinkButton
                    data-toc-id={item.id}
                    data-cursor="target"
                    href={href}
                    nativeLink
                    keepFeedback
                    hoverSound="tick"
                    pressSound="link"
                    prefetch={false}
                    onClick={(e) => {
                        if (isSameUrl(href)) {
                            e.preventDefault()
                        }
                    }}
                    onPress={() => {
                        if (isSameUrl(href)) {
                            onSameLinkClick()
                            return
                        }

                        if (item.mode === "route") return

                        onPress(item)
                    }}
                    className={cn(
                        "group/link relative flex-1 truncate leading-6",
                        item.icon
                            ? "flex items-center gap-2 py-1.5"
                            : "inline-block py-1",
                        isProject
                            ? "ps-14 text-foreground dark:text-muted-foreground"
                            : "ps-6 font-wght-600",
                        isActive
                            ? "!text-highlighted font-wght-600"
                            : {
                                  "group-hover":
                                      "transition-[color] duration-100",
                                  hover: [
                                      "!transition-none",
                                      isProject
                                          ? "text-muted-foreground dark:text-foreground"
                                          : "text-foreground"
                                  ],
                                  "focus-visible": "text-foreground"
                              }
                    )}
                >
                    {item.icon && (
                        <div
                            className={cn(
                                "grid size-6 place-items-center rounded-md",
                                isActive
                                    ? "bg-highlighted text-white dark:bg-highlighted/70"
                                    : [
                                          "bg-muted-foreground/15 dark:bg-muted-foreground/20",
                                          {
                                              "group-hover":
                                                  "transition-[background-color,color] duration-100",
                                              "group-hover/link":
                                                  "bg-muted-foreground/30 text-default !transition-none dark:bg-muted-foreground/40"
                                          }
                                      ],
                                "translate-x-[calc(var(--effect,0)*var(--max-shift,1.875rem)*0.9)]"
                            )}
                        >
                            {item.icon}
                        </div>
                    )}
                    <span
                        data-cursor="lock"
                        className={cn(
                            "block w-fit max-w-full px-1.25",
                            isCategory && "-ms-1.25",
                            "translate-x-[calc(var(--effect,0)*var(--max-shift,1.875rem))]"
                        )}
                    >
                        {highlightQuery(item.label, query ?? "") ??
                            formatOrdinals(item.label)}
                    </span>
                    {isActive && (
                        <div
                            className={cn(
                                "absolute top-1/2 hidden size-6 -translate-y-1/2 place-items-center rounded-full bg-highlighted/10 text-highlighted",
                                isCollapsible ? "right-0" : "right-5.5",
                                "group-hover:grid dark:bg-highlighted/20"
                            )}
                        >
                            {mode === "pages" ? (
                                <ArrowRight className={cn("size-3.5")} />
                            ) : (
                                <ArrowUp className={cn("size-3.5")} />
                            )}
                        </div>
                    )}
                </LinkButton>
                {isCollapsible && (
                    <TooltipTrigger
                        delay={500}
                        payload={{
                            content: (
                                <span>
                                    {isCollapsed ? "Expand" : "Collapse"} this
                                    category
                                </span>
                            ),
                            side: "right",
                            sideOffset: -14
                        }}
                        render={
                            <Button
                                nativeButton
                                keepFeedback
                                pressSound={
                                    isCollapsed ? "zoom-out" : "zoom-in"
                                }
                                onPress={onToggle}
                                data-no-sidebar-effect
                                className={cn(
                                    "group/button pe-5.5 ps-2.5",
                                    "group-has-[input:not(:placeholder-shown)]/sidebar:hidden"
                                )}
                            >
                                <div
                                    data-cursor="lock"
                                    className={cn(
                                        "my-1 grid size-6 place-items-center rounded-[.75rem] !corner-round transition-[border-radius,transform,translate] duration-100",
                                        isCollapsed
                                            ? "bg-foreground/40 text-inverted dark:bg-foreground/60"
                                            : "bg-foreground/10 dark:bg-foreground/15",
                                        {
                                            "group-hover/button":
                                                "rounded-none duration-200",
                                            "group-active/button":
                                                "translate-y-0.5"
                                        }
                                    )}
                                >
                                    <ChevronDown
                                        className={cn(
                                            "size-5 transition-transform duration-200",
                                            isCollapsed
                                                ? "translate-x-[.5px] -rotate-90 dark:stroke-3"
                                                : "translate-y-[.5px]"
                                        )}
                                    />
                                </div>
                                <span className="sr-only">
                                    {isCollapsed ? "Expand" : "Collapse"} this
                                    category
                                </span>
                            </Button>
                        }
                    />
                )}
            </Comp>
            // </ViewTransition>
        )
    }
)
TocItemRow.displayName = "TocItemRow"

export type { TocItemProps, TocItemRowProps }
export { TocItemRow }
