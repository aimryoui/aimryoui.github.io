"use client"

import { memo } from "react"
import { usePathname } from "next/navigation"

import { ArrowRight } from "@/components/icons/icons"
import { LinkButton } from "@/components/ui/button"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { highlightQuery } from "@/helpers/highlight-query"
import { isSameUrl } from "@/helpers/is-same-url"
import { cn } from "@/lib/utils"
import { type TocItemRowProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocActiveId } from "@/portfolio/_hooks/use-toc-scroll"

const MobileTocItemRow = memo(
    ({
        className,
        item,
        variant = "anchor",
        query,
        onPress,
        onSameLinkClick,
        onLinkClick,
        children,
        ...props
    }: TocItemRowProps & { onLinkClick?: () => void }) => {
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
            <Comp
                className={cn(
                    "pointer-events-auto relative mx-safe-zone box-content flex h-fit touch-auto list-inside items-center",
                    isProject && [
                        "border-s-1 border-muted-foreground/20",
                        isActive
                            ? {
                                  before: "absolute inset-y-0 -start-0.25 w-0.75 bg-highlighted"
                              }
                            : {
                                  hover: {
                                      before: "absolute inset-y-0 -start-0.25 w-0.75 bg-muted-foreground/80 dark:bg-muted-foreground"
                                  },
                                  active: {
                                      before: "!bg-highlighted"
                                  }
                              },
                        {
                            "last-of-type": "mb-1.5"
                        }
                    ],
                    className
                )}
                {...props}
            >
                <LinkButton
                    data-toc-id={item.id}
                    aria-current={isCurrent}
                    href={href}
                    nativeLink
                    keepFeedback
                    hoverSound="tick"
                    pressSound={isProject ? "link" : "button"}
                    haptic={isProject ? "light" : "success"}
                    onClick={(e) => {
                        // Strip query AND hash to compare only the pathname
                        const hrefPathname = href.split("?")[0].split("#")[0]
                        const isSamePath =
                            hrefPathname === pathname || hrefPathname === ""
                        if (isSameUrl(href) || isSamePath) {
                            e.preventDefault()
                        }
                    }}
                    tracking={{
                        eventName: "click_toc_link",
                        eventParams: {
                            toc_item_id: item.id,
                            toc_item_label: item.label,
                            toc_variant: variant,
                            is_mobile: true,
                            ...(item.mode && { toc_mode: item.mode }),
                            ...(query && { search_query: query })
                        }
                    }}
                    onPress={() => {
                        if (isSameUrl(href)) {
                            onSameLinkClick()
                            return
                        }

                        // Strip query AND hash to compare only the pathname.
                        const hrefPathname = href.split("?")[0].split("#")[0]
                        const isSamePath =
                            hrefPathname === pathname || hrefPathname === ""
                        if (item.mode === "route" && !isSamePath) {
                            // Let the native link navigation happen
                            onLinkClick?.()
                            return
                        }

                        onPress(item)

                        if (isSamePath && item.mode === "route") {
                            onSameLinkClick()
                        }
                    }}
                    className={cn(
                        "group/link relative flex-1 truncate leading-6",
                        item.icon
                            ? "flex items-center gap-3.5 py-2"
                            : "inline-block py-2",
                        isProject
                            ? "px-safe-zone text-foreground dark:text-muted-foreground"
                            : "font-wght-500 font-slnt-0",
                        isActive
                            ? "pe-[calc(var(--spacing-safe-zone)+var(--spacing)*7)] !text-highlighted font-wght-600"
                            : {
                                  hover: isProject
                                      ? "text-muted-foreground dark:text-foreground"
                                      : "text-foreground",
                                  active: "!text-highlighted",
                                  "focus-visible": "text-foreground"
                              }
                    )}
                >
                    {item.icon && (
                        <div
                            className={cn(
                                "grid size-9 place-items-center rounded-full",
                                isActive
                                    ? "bg-highlighted text-white dark:bg-highlighted/70"
                                    : [
                                          "bg-muted-foreground/15 dark:bg-muted-foreground/20",
                                          {
                                              "group-hover":
                                                  "transition-[background-color,color] duration-100",
                                              "group-hover/link":
                                                  "bg-muted-foreground/30 text-default !transition-none dark:bg-muted-foreground/40",
                                              "group-active/link":
                                                  "bg-highlighted/15 text-highlighted !transition-none dark:bg-highlighted/25"
                                          }
                                      ],
                                "[&>svg]:size-6"
                            )}
                        >
                            {item.icon}
                        </div>
                    )}
                    <bdi translate="no">
                        {highlightQuery(item.label, query ?? "")
                            ?? formatOrdinals(item.label)}
                    </bdi>
                    {isActive && (
                        <div
                            className={cn(
                                "absolute end-0 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-highlighted/10 text-highlighted",
                                "dark:bg-highlighted/20"
                            )}
                        >
                            <ArrowRight
                                className={cn("size-4 rtl:rotate-180")}
                            />
                        </div>
                    )}
                </LinkButton>
                {children}
            </Comp>
        )
    }
)
MobileTocItemRow.displayName = "MobileTocItemRow"

export { MobileTocItemRow }
