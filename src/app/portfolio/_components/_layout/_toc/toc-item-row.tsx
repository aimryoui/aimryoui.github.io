"use client"

import { memo } from "react"
import Link from "next/link"

import { ChevronDown } from "lucide-react"
import { type Variants } from "motion/react"
import * as m from "motion/react-m"

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

const liVariants: Variants = {
    hidden: { x: 10, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, bounce: 0 }
    }
}

const TocItemRow = memo(
    ({
        mode,
        item,
        isActive,
        onClick,
        onSameLinkClick
    }: {
        mode: PortfolioMode
        item: TocItemProps
        isActive: boolean
        onClick: (item: TocItemProps) => void
        onSameLinkClick: () => void
    }) => {
        const href = item.href ?? `#${item.id}`

        return (
            <m.li
                variants={liVariants}
                className={cn(
                    item.depth === 3 &&
                        !item.icon &&
                        "border-s-[.0625rem] border-muted-foreground/20",
                    "relative mx-6 box-content flex h-fit list-inside items-center gap-4 will-change-[transform,opacity]",
                    item.depth === 3 &&
                        isActive &&
                        !item.icon && {
                            before: "absolute inset-y-0 -left-[.0625rem] w-0.75 bg-highlighted"
                        }
                )}
            >
                <Link
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
                        isActive
                            ? "text-highlighted"
                            : {
                                  "group-hover":
                                      "transition-[color] duration-100",
                                  hover: "text-foreground !transition-none",
                                  "focus-visible": "text-foreground"
                              },
                        "group/link relative flex-1 leading-6 will-change-[color]",
                        item.depth === 3 && !item.icon ? "ps-3" : "font-bold",
                        item.icon ? "flex gap-2 py-1" : "inline-block py-0.5"
                    )}
                >
                    {item.icon && (
                        <div
                            className={cn(
                                "grid size-6 place-items-center rounded-md will-change-[background-color,color]",
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
                                      ]
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
                </Link>
                {item.depth === 2 && item.id !== "outlines" && (
                    <div
                        className={cn(
                            "grid size-5 place-items-center rounded-full bg-default/5",
                            "group-has-[input:not(:placeholder-shown)]/sidebar:hidden dark:bg-default/10"
                        )}
                    >
                        <ChevronDown className="size-4" />
                    </div>
                )}
            </m.li>
        )
    }
)
TocItemRow.displayName = "TocItemRow"

export type { TocItemProps }
export { TocItemRow }
