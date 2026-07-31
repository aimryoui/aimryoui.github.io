"use client"

import type React from "react"
import { memo } from "react"
import { usePathname } from "next/navigation"

import { ArrowRight, ArrowUp } from "@/components/icons/icons"
import { LinkButton } from "@/components/ui/button"
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

type TocItemVariant = "category" | "project" | "anchor"

type TocItemRowProps = React.ComponentProps<"li"> &
    React.ComponentProps<"div"> & {
        variant?: TocItemVariant
        mode: PortfolioMode
        item: TocItemProps
        query?: string
        onPress: (item: TocItemProps) => void
        onSameLinkClick: () => void
    }

const TocItemRow = memo(
    ({
        className,
        variant = "anchor",
        mode,
        item,
        query,
        onPress,
        onSameLinkClick,
        children,
        ...props
    }: TocItemRowProps) => {
        const pathname = usePathname()

        const isActive = useTocActiveId((s) => s.activeId === item.id)
        const href = item.href ?? `#${item.id}`

        const isCurrent = isActive
            ? href === pathname
                ? "page"
                : "true"
            : undefined

        const isProject = variant === "project"
        const isCategory = variant === "category"
        const isAnchor = variant === "anchor"

        const Comp = isProject || isAnchor ? "li" : "div"

        return (
            // <ViewTransition key={item.id} name={`toc-item-${item.id}`}>
            <Comp
                data-toc-item
                className={cn(
                    "group/item relative box-content flex h-fit list-inside items-center",
                    {
                        // Tick
                        after: [
                            "absolute left-6 top-[calc(100%+var(--item-gap)/2)] h-px origin-left -translate-y-1/2 bg-[--marker-color] opacity-60",
                            "last:hidden has-[+[role=separator]]:hidden",
                            isProject
                                ? "w-[calc(var(--marker-length)*var(--tick-scale))] scale-x-[calc(1+var(--effect,0)*1.5)]"
                                : "w-1.25 scale-x-[--effect,0] transition-[width] group-not-data-expanded/collapsible:w-0"
                        ]
                    },
                    className
                )}
                {...props}
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
                    aria-current={isCurrent}
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
                        "group/link relative flex flex-1 items-center truncate py-1 leading-6",
                        isProject
                            ? [
                                  "ps-14 text-foreground dark:text-muted-foreground",
                                  {
                                      "group-last-of-type/item": "-mb-3 pb-4"
                                  }
                              ]
                            : "font-wght-600",
                        isCategory ? "ps-6" : !isProject && "pe-5.5 ps-6",
                        isAnchor && [
                            "gap-2",
                            {
                                "group-first-of-type/item": "-mt-3 pt-4",
                                "group-last-of-type/item": "-mb-3 pb-4"
                            }
                        ],
                        {
                            "group-hover": "transition-[color] duration-100",
                            hover: [
                                "!transition-none",
                                isProject
                                    ? "text-muted-foreground dark:text-foreground"
                                    : "text-foreground"
                            ],
                            "focus-visible": "text-foreground",
                            "data-current":
                                "text-highlighted font-wght-600 dark:text-highlighted",
                            "group-[>:first-child]/collapsible": "-mt-3 pt-4",
                            "group-[:not([data-expanded=true])>:first-child]/collapsible":
                                "-mb-3 pb-4"
                        }
                    )}
                >
                    {item.icon && (
                        <div
                            className={cn(
                                "my-0.5 grid size-6 place-items-center rounded-md bg-muted-foreground/15",
                                "translate-x-[calc(var(--effect,0)*var(--max-shift,1.875rem)*0.9)]",
                                {
                                    dark: "bg-muted-foreground/20",
                                    "group-hover":
                                        "transition-[background-color,color] duration-100",
                                    "group-hover/link":
                                        "bg-muted-foreground/30 text-default !transition-none dark:bg-muted-foreground/40",
                                    "group-data-current/link":
                                        "bg-highlighted text-white dark:bg-highlighted/65"
                                }
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
                                "ms-auto hidden size-6 place-items-center rounded-full bg-highlighted/10 text-highlighted",
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
                {children}
            </Comp>
            // </ViewTransition>
        )
    }
)
TocItemRow.displayName = "TocItemRow"

export type { TocItemProps, TocItemRowProps, TocItemVariant }
export { TocItemRow }
