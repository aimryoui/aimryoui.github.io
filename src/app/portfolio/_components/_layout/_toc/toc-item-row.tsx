"use client"

import { memo } from "react"
import NextLink from "next/link"

import { ChevronDown } from "lucide-react"

import { ArrowRight, ArrowUp } from "@/components/icons/icons"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { cn } from "@/lib/utils"
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
    isActive: boolean
    onClick: (item: TocItemProps) => void
    onSameLinkClick: () => void
}

const TocItemRow = memo(
    ({ mode, item, isActive, onClick, onSameLinkClick }: TocItemRowProps) => {
        const href = item.href ?? `#${item.id}`

        const isProject = item.depth === 3 && !item.icon
        const isCollapsible = item.depth === 2 && item.id !== "outlines"

        return (
            // <ViewTransition key={item.id} name={`toc-item-${item.id}`}>
            <li
                className={cn(
                    "relative box-content flex h-fit list-inside items-center gap-4 will-change-[transform,opacity] [transform:translateZ(0)]",
                    {
                        // Tick
                        after: [
                            "absolute left-6 top-[calc(100%+var(--item-gap)/2)] h-[.0625rem] origin-left -translate-y-1/2 bg-[var(--marker-color)] opacity-60",
                            "last:hidden has-[+[role=separator]]:hidden",
                            isProject
                                ? "w-[calc(var(--marker-length)*var(--tick-scale))] scale-x-[calc(1+var(--effect,0)*1.5)]"
                                : "w-1.25 scale-x-[var(--effect,0)]"
                        ]
                    }
                )}
            >
                {/* Marker */}
                <span
                    aria-hidden="true"
                    className={cn(
                        "absolute left-6 top-1/2 h-[.0625rem] origin-left -translate-y-1/2",
                        isActive
                            ? "bg-highlighted"
                            : "bg-[color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--marker-color))]",
                        isProject
                            ? "w-[var(--marker-length)] scale-x-[calc(1+var(--effect,0))]"
                            : "w-2.5 scale-x-[var(--effect,0)]"
                    )}
                />
                <NextLink
                    prefetch={false}
                    href={href}
                    data-toc-id={item.id}
                    data-cursor="target"
                    onClick={(e) => {
                        const isSameUrl = (() => {
                            try {
                                const targetUrl = new URL(
                                    href,
                                    window.location.href
                                )
                                const targetSearch =
                                    targetUrl.search.startsWith("?")
                                        ? targetUrl.search.slice(1)
                                        : targetUrl.search

                                const currentSearch =
                                    window.location.search.startsWith("?")
                                        ? window.location.search.slice(1)
                                        : window.location.search

                                return (
                                    window.location.pathname ===
                                        targetUrl.pathname &&
                                    currentSearch === targetSearch &&
                                    window.location.hash === targetUrl.hash
                                )
                            } catch {
                                return false
                            }
                        })()

                        if (isSameUrl) {
                            e.preventDefault()
                            onSameLinkClick()
                            return
                        }

                        if (item.mode === "route") return

                        e.preventDefault()
                        onClick(item)
                    }}
                    className={cn(
                        "group/link relative flex-1 truncate leading-6 will-change-[color]",
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
                                "grid size-6 place-items-center rounded-md will-change-[transform,background-color,color]",
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
                            "block w-fit max-w-full px-1.25 will-change-transform",
                            !isProject && !item.icon && "-ms-1.25",
                            "translate-x-[calc(var(--effect,0)*var(--max-shift,1.875rem))]"
                        )}
                    >
                        {formatOrdinal(item.label)}
                    </span>
                    {isActive && (
                        <div
                            className={cn(
                                "absolute top-1/2 hidden size-5 -translate-y-1/2 place-items-center rounded-full bg-highlighted/10 text-highlighted",
                                isCollapsible ? "right-0" : "right-5.5",
                                "group-hover:grid group-focus-visible/link:hidden dark:bg-highlighted/20"
                            )}
                        >
                            {mode === "pages" ? (
                                <ArrowRight className={cn("size-3")} />
                            ) : (
                                <ArrowUp className={cn("size-3")} />
                            )}
                        </div>
                    )}
                </NextLink>
                {isCollapsible && (
                    <div
                        className={cn(
                            "me-5.5 grid size-5 place-items-center rounded-full bg-default/5",
                            "group-has-[input:not(:placeholder-shown)]/sidebar:hidden dark:bg-default/10"
                        )}
                    >
                        <ChevronDown className="size-4" />
                    </div>
                )}
            </li>
            // </ViewTransition>
        )
    }
)
TocItemRow.displayName = "TocItemRow"

export type { TocItemProps, TocItemRowProps }
export { TocItemRow }
