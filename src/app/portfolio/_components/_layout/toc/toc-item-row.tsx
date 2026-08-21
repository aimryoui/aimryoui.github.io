"use client"

import { memo } from "react"
import { usePathname } from "next/navigation"

import { ArrowRight } from "@/components/icons/icons"
import { LinkButton } from "@/components/ui/button"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { highlightQuery } from "@/helpers/highlight-query"
import { isSameUrl } from "@/helpers/is-same-url"
import { cn } from "@/lib/utils"
import { useTocActiveId } from "@/portfolio/_hooks/use-toc-scroll"

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

type TocItemRowProps = React.ComponentProps<"li">
    & React.ComponentProps<"div"> & {
        variant?: TocItemVariant
        item: TocItemProps
        query?: string
        onPress: (item: TocItemProps) => void
        onSameLinkClick: () => void
    }

const TocItemRow = memo(
    ({
        className,
        variant = "anchor",
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
        const isSelectedWorks = item.id === "selected-works"

        const hrefPathname = href.split("?")[0].split("#")[0]
        const isSamePath = hrefPathname === pathname || hrefPathname === ""

        const Comp = isProject || isAnchor ? "li" : "div"
        const LabelComp = isProject ? "bdi" : "span"

        return (
            // <ViewTransition key={item.id} name={`toc-item-${item.id}`}>
            <Comp
                data-toc-item
                className={cn(
                    "group/item relative box-content flex h-fit list-inside items-center",
                    isProject && {
                        "not-data-line-sidebar": [
                            {
                                before: "absolute inset-y-0 start-safe-zone w-0.25 bg-muted-foreground/20"
                            },
                            isActive
                                ? {
                                      before: "w-0.5 bg-highlighted"
                                  }
                                : {
                                      "not-data-target-cursor:hover": {
                                          before: "w-0.5 bg-muted-foreground/80 dark:bg-muted-foreground"
                                      },
                                      "data-target-cursor:active": {
                                          before: "!bg-muted-foreground/80 dark:!bg-muted-foreground"
                                      },
                                      active: {
                                          before: "w-0.5 !bg-highlighted"
                                      }
                                  }
                        ]
                    },
                    {
                        // Tick
                        after: [
                            "not-data-line-sidebar:hidden",
                            "absolute start-safe-zone top-[calc(100%+var(--item-gap)/2)] h-px origin-left -translate-y-1/2 bg-[--marker-color] opacity-60",
                            "last:hidden has-[+[role=separator]]:hidden rtl:origin-right",
                            isProject
                                ? [
                                      "w-[calc(var(--marker-length)*var(--tick-scale))]",
                                      {
                                          "motion-preferred":
                                              "scale-x-[calc(1+var(--effect,0)*1.5)]"
                                      }
                                  ]
                                : {
                                      "motion-preferred":
                                          "w-1.25 scale-x-[--effect,0] transition-[width] group-not-data-expanded/collapsible:w-0"
                                  }
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
                        "not-data-line-sidebar:hidden",
                        "absolute start-safe-zone top-1/2 h-px origin-left -translate-y-1/2",
                        "rtl:origin-right",
                        isActive
                            ? "bg-highlighted"
                            : "bg-[color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--marker-color))]",
                        isProject
                            ? "w-[--marker-length] motion-preferred:scale-x-[calc(1+var(--effect,0))]"
                            : {
                                  "motion-preferred":
                                      "w-2.5 scale-x-[--effect,0]"
                              }
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
                    scroll={!isSamePath}
                    tracking={{
                        eventName: "click_toc_link",
                        eventParams: {
                            toc_item_id: item.id,
                            toc_item_label: item.label,
                            toc_variant: variant,
                            is_mobile: false,
                            ...(item.mode && { toc_mode: item.mode }),
                            ...(query && { search_query: query })
                        }
                    }}
                    onPress={() => {
                        if (item.mode === "route" && !isSamePath) {
                            return
                        }

                        onPress(item)

                        // If the item is already active in the TOC, it's a repeat click
                        if (isActive) {
                            onSameLinkClick()
                        }

                        requestAnimationFrame(() => {
                            const el = document.getElementById(item.id)
                            if (el)
                                el.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                })
                        })
                    }}
                    className={cn(
                        "group/link relative flex flex-1 items-center truncate py-1 leading-6",
                        isProject
                            ? [
                                  "pe-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)] ps-14 text-foreground dark:text-muted-foreground",
                                  {
                                      "not-data-line-sidebar": "ps-9",
                                      "group-last-of-type/item": "-mb-3 pb-4"
                                  }
                              ]
                            : "font-wght-600",
                        isCategory
                            ? "ps-safe-zone"
                            : !isProject
                                  && "pe-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)] ps-safe-zone",
                        (isAnchor || isSelectedWorks) && [
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
                                {
                                    dark: "bg-muted-foreground/20",

                                    "data-line-sidebar":
                                        "translate-x-[--move-x] [--move-x:calc(var(--effect,0)*var(--max-shift,1.875rem)*0.9)] rtl:-translate-x-[--move-x]",

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
                    <LabelComp
                        data-cursor="lock"
                        translate="no"
                        className={cn(
                            "block w-fit max-w-full px-1.25",
                            isCategory && !isSelectedWorks && "-ms-1.25",
                            {
                                "data-line-sidebar":
                                    "translate-x-[--move-x] [--move-x:calc(var(--effect,0)*var(--max-shift,1.875rem))] rtl:-translate-x-[--move-x]"
                            }
                        )}
                    >
                        {highlightQuery(item.label, query ?? "")
                            ?? formatOrdinals(item.label)}
                    </LabelComp>
                    {isActive && (
                        <div
                            className={cn(
                                "ms-auto hidden size-6 place-items-center rounded-full bg-highlighted/10 text-highlighted",
                                "group-hover:grid dark:bg-highlighted/20"
                            )}
                        >
                            <ArrowRight
                                className={cn(
                                    "size-3 scale-125 rtl:rotate-180"
                                )}
                            />
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
