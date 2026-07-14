"use client"

import { memo } from "react"
import NextLink from "next/link"

import { ChevronDown } from "lucide-react"

import { ArrowRight, ArrowUp } from "@/components/icons/icons"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { cn } from "@/lib/utils"
import { type TocItemRowProps } from "@/portfolio/_components/_layout/_toc/toc-item-row"

const MobileTocItemRow = memo(
    ({ mode, item, isActive, onClick, onSameLinkClick }: TocItemRowProps) => {
        const href = item.href ?? `#${item.id}`

        const isProject = item.depth === 3 && !item.icon

        return (
            <li
                className={cn(
                    "relative mx-6 box-content flex h-fit list-inside items-center gap-4",
                    isProject && [
                        "border-s-[.0625rem] border-muted-foreground/20",
                        isActive
                            ? {
                                  before: "absolute inset-y-0 -left-[.0625rem] w-0.75 bg-highlighted"
                              }
                            : {
                                  hover: {
                                      before: "absolute inset-y-0 -left-[.0625rem] w-0.75 bg-muted-foreground/80 dark:bg-muted-foreground"
                                  }
                              }
                    ]
                )}
            >
                <NextLink
                    href={href}
                    data-toc-id={item.id}
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
                        "group/link relative flex-1 truncate leading-6 will-change-[color,font-variation-settings] [contain:layout_paint]",
                        item.icon
                            ? "flex items-center gap-4 py-2.5"
                            : "inline-block py-3",
                        isProject
                            ? "ps-6.5 text-foreground dark:text-muted-foreground"
                            : "font-wght-600 font-slnt-0",
                        isActive
                            ? "!text-highlighted font-wght-[600]"
                            : {
                                  "group-hover":
                                      "transition-[color,font-variation-settings] ease-spring duration-500",
                                  hover: isProject
                                      ? "text-muted-foreground font-wght-[600] !transition-[font-variation-settings] dark:text-foreground"
                                      : "text-foreground -font-slnt-10 !transition-[font-variation-settings]",
                                  active: "text-highlighted font-wght-[600]",
                                  "focus-visible": "text-foreground"
                              }
                    )}
                >
                    {item.icon && (
                        <div
                            className={cn(
                                "grid size-9 place-items-center rounded-lg will-change-[background-color,color]",
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
                                "[&>svg]:size-6"
                            )}
                        >
                            {item.icon}
                        </div>
                    )}
                    {formatOrdinal(item.label)}
                    {isActive && (
                        <div
                            className={cn(
                                "absolute right-0 top-1/2 hidden size-5 -translate-y-1/2 place-items-center rounded-full bg-highlighted/10 text-highlighted",
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
                {item.depth === 2 && item.id !== "outlines" && (
                    <div
                        className={cn(
                            "grid size-8 place-items-center rounded-full bg-default/5",
                            "group-has-[input:not(:placeholder-shown)]/sidebar:hidden dark:bg-default/10"
                        )}
                    >
                        <ChevronDown className="mt-[1px] size-6" />
                    </div>
                )}
            </li>
        )
    }
)
MobileTocItemRow.displayName = "MobileTocItemRow"

export { MobileTocItemRow }
