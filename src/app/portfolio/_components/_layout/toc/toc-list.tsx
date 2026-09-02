import { useCallback } from "react"

import {
    LineSidebar,
    type LineSidebarProps
} from "@/components/animations/line-sidebar"
import { SmoothScrolling } from "@/components/animations/smooth-scrolling"
import { getPreferences } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import { TocGroup } from "@/portfolio/_components/_layout/toc/toc-group"
import { TocItemRow } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import {
    scrollElementToCenter,
    useTocScroll
} from "@/portfolio/_hooks/use-toc-scroll"
import { useTocTree } from "@/portfolio/_hooks/use-toc-tree"

interface TocListProps extends LineSidebarProps {
    onActiveReady?: () => void
    onItemPress?: (item: TocItemProps) => void
}
function handleItemClick(
    item: TocItemProps,
    clickedTargetRef: React.RefObject<string | null>,
    tocContainer?: HTMLElement | null
) {
    const targetId = item.id
    if (item.mode === "route" && item.href) {
        clickedTargetRef.current = null
        let tocEl = tocContainer?.querySelector(
            `[data-toc-id="${targetId}"][data-toc-href="${item.href}"]`
        )
        tocEl ??= tocContainer?.querySelector(`[data-toc-id="${targetId}"]`)
        if (tocEl) {
            const { motionReduced } = getPreferences()
            scrollElementToCenter(
                tocEl as HTMLElement,
                motionReduced ? "instant" : "smooth"
            )
        }
    } else {
        clickedTargetRef.current = targetId
    }
}
function TocList({ className, onActiveReady, onItemPress, ...props }: TocListProps) {
    const compact = useTocStore((s) => s.compact)
    const items = useTocStore((s) => s.items)
    const filteredItems = useTocStore((s) => s.filteredItems)
    const debouncedQuery = useTocStore((s) => s.query)
    const lineSidebarEffect = useTocStore((s) => s.lineSidebarEffect ?? true)

    const { scrollContainerRef, clickedTargetRef } = useTocScroll({
        items,
        debouncedQuery,
        onActiveReady
    })
    const handlePress = useCallback(
        (item: TocItemProps) => {
            handleItemClick(item, clickedTargetRef, scrollContainerRef.current)
            onItemPress?.(item)
        },
        [clickedTargetRef, scrollContainerRef, onItemPress]
    )
    const tree = useTocTree(filteredItems)

    const firstGroupIndex = tree.findIndex((node) => node.type === "group")
    const lastGroupIndex = tree.findLastIndex((node) => node.type === "group")

    const ScrollContainer = lineSidebarEffect ? LineSidebar : "div"

    return (
        <SmoothScrolling
            className={cn(
                "group overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto scrollbar-none",
                "scroll-fade-y scroll-fade-18 group-has-[input:not(:placeholder-shown)]/sidebar:scroll-fade-none",
                "hover:scrollbar-thin",
                compact
                    ? {
                          "group-is-[[data-sidebar-position='inline-end'][data-effects~='target-cursor']]/html":
                              "ltr:rtl rtl:ltr"
                      }
                    : {
                          "group-is-[[data-sidebar-position='inline-start'][data-effects~='target-cursor']]/html":
                              "ltr:rtl rtl:ltr"
                      },
                {
                    // after: "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-alert",
                    md: "scroll-fade-16"
                },
                className
            )}
        >
            <ScrollContainer
                data-line-sidebar={lineSidebarEffect}
                ref={scrollContainerRef}
                {...(lineSidebarEffect && {
                    itemSelector: "[data-toc-item]"
                })}
                className={cn(
                    compact
                        ? "[--marker-length:.75rem]"
                        : "[--marker-length:1.5rem]",
                    "h-max w-full overflow-visible py-3"
                )}
                {...props}
            >
                {tree.map((node, index) => {
                    if (node.type === "divider") {
                        if (compact) return null
                        return (
                            <TocDivider
                                key={`div-${node.id}`}
                                className={cn("ltr:ltr rtl:rtl")}
                            />
                        )
                    }
                    if (node.type === "group") {
                        return (
                            <TocGroup
                                key={`group-${node.header.id}`}
                                header={node.header}
                                items={node.items}
                                onItemPress={handlePress}
                                isFirst={index === firstGroupIndex}
                                isLast={index === lastGroupIndex}
                                className={cn("ltr:ltr rtl:rtl")}
                            />
                        )
                    }
                    return (
                        <ul
                            key={`anchors-${node.items[0].id}`}
                            className={cn("flex flex-col ltr:ltr rtl:rtl")}
                        >
                            {node.items.map((item) => (
                                <TocItemRow
                                    key={item.id}
                                    variant="anchor"
                                    item={item}
                                    onPress={handlePress}
                                />
                            ))}
                        </ul>
                    )
                })}
            </ScrollContainer>
        </SmoothScrolling>
    )
}

export type { TocListProps }
export { handleItemClick, TocList }
