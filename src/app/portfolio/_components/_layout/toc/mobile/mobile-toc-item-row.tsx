"use client"

import { memo } from "react"
import { usePathname } from "next/navigation"

import { ArrowRight } from "@/components/icons/icons"
import { Link } from "@/components/ui/link"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { highlightQuery } from "@/helpers/highlight-query"
import { getPreferences } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"
import { useMobileTocStore } from "@/portfolio/_components/_layout/toc/stores/mobile-toc-store"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { type TocItemRowProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useFlashStore } from "@/portfolio/_components/flash-overlay"

function scrollToTarget(id: string) {
    requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (!el) return

        const { motionReduced } = getPreferences()
        el.scrollIntoView({
            behavior: motionReduced ? "instant" : "smooth",
            block: "start"
        })
    })
}

const MobileTocItemRow = memo(
    ({
        className,
        item,
        variant = "anchor",
        onPress,
        children,
        activeViaChild,
        ...props
    }: TocItemRowProps) => {
        const pathname = usePathname()

        const query = useTocStore((s) => s.query)
        const _isActive = useTocStore((s) => s.activeId === item.id)
        const isActive = activeViaChild ?? _isActive
        const href = item.href ?? `#${item.id}`

        const isCurrent = isActive
            ? href === pathname
                ? "page"
                : "true"
            : undefined

        const isItem = variant === "item"
        const isHeader = variant === "header"
        const isAnchorItem = variant === "anchor"

        const hrefPathname = href.split("?")[0].split("#")[0]
        const isSamePath = hrefPathname === pathname || hrefPathname === ""

        const Comp = isItem || isAnchorItem ? "li" : "div"

        return (
            <Comp
                className={cn(
                    "pointer-events-auto relative mx-safe-zone box-content flex h-fit touch-auto list-inside items-center",
                    isItem && [
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
                <Link
                    data-toc-id={item.id}
                    data-toc-href={href}
                    aria-current={isCurrent}
                    href={href}
                    pressSound={isItem ? "link" : "button"}
                    haptic={isItem ? "light" : "success"}
                    scroll={!isSamePath}
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
                        if (item.mode === "route" && !isSamePath) {
                            useMobileTocStore.getState().setIsTocOpen(false)
                            return
                        }

                        onPress(item)

                        // If the item is already active in the TOC, it's a repeat click
                        if (isActive) {
                            useFlashStore.getState().triggerFlash()
                        }

                        scrollToTarget(item.id)
                    }}
                    className={cn(
                        "group/link relative flex-1 truncate leading-6",
                        item.icon
                            ? "flex items-center gap-3.5 py-2"
                            : "inline-block py-2",
                        isItem
                            ? "px-safe-zone text-foreground dark:text-muted-foreground"
                            : "font-wght-600",
                        isActive
                            ? "pe-[calc(var(--spacing-safe-zone)+var(--spacing)*7)] !text-highlighted font-wght-600"
                            : {
                                  hover: isItem
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
                        {highlightQuery(item.label, query)
                            ?? formatOrdinals(item.label)}
                        {item.caseStudy && (
                            <>
                                {" "}
                                <i className="text-muted-foreground/70 font-wght-450">
                                    (Case Study)
                                </i>
                            </>
                        )}
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
                </Link>
                {children}
            </Comp>
        )
    }
)
MobileTocItemRow.displayName = "MobileTocItemRow"

export { MobileTocItemRow }
