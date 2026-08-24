import { useCallback } from "react"

import {
    LineSidebar,
    type LineSidebarProps
} from "@/components/animations/line-sidebar"
import { SmoothScrolling } from "@/components/animations/smooth-scrolling"
import { getPreferences } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import { TocGroup } from "@/portfolio/_components/_layout/toc/toc-group"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"
import { useTocTree } from "@/portfolio/_hooks/use-toc-tree"

interface TocListProps extends LineSidebarProps {
    items: TocItemProps[]
    filteredItems: TocItemProps[]
    debouncedQuery: string
}

function handleItemClick(
    item: TocItemProps,
    clickedTargetRef: React.RefObject<string | null>,
    tocContainer?: HTMLElement | null
) {
    const targetId = item.id

    if (item.mode === "route" && item.href) {
        // For same-pathname route items: update URL first so window.location.search
        // reflects the new query, then scroll TOC to the exact matching element.
        // Do NOT scroll the page — content doesn't change.
        clickedTargetRef.current = null
        window.history.pushState(null, "", item.href)
        const tocEl = tocContainer?.querySelector(
            `[data-toc-id="${targetId}"][href="${item.href}"]`
        )
        if (tocEl) {
            const { motionReduced } = getPreferences()
            tocEl.scrollIntoView({
                block: "center",
                behavior: motionReduced ? "instant" : "smooth"
            })
        }
    } else {
        clickedTargetRef.current = targetId
    }
}

function TocList({
    className,
    items,
    filteredItems,
    debouncedQuery,
    onActiveReady,
    ...props
}: TocListProps & {
    onActiveReady?: () => void
}) {
    const { scrollContainerRef, clickedTargetRef } = useTocScroll({
        items,
        debouncedQuery,
        onActiveReady
    })

    const handlePress = useCallback(
        (item: TocItemProps) => {
            handleItemClick(item, clickedTargetRef, scrollContainerRef.current)
        },
        [clickedTargetRef, scrollContainerRef]
    )

    const tree = useTocTree(filteredItems)

    return (
        <SmoothScrolling
            className={cn(
                "group overflow-x-hidden overflow-y-scroll scroll-auto scrollbar-none",
                "scroll-fade-y scroll-fade-18 group-has-[input:not(:placeholder-shown)]/sidebar:scroll-fade-none",
                "hover:scrollbar-thin",
                {
                    "group-is-[[data-sidebar-position='inline-start'][data-effects~='target-cursor']]/html":
                        "ltr:rtl rtl:ltr"
                },
                className
            )}
        >
            <LineSidebar
                ref={scrollContainerRef}
                itemSelector="[data-toc-item]"
                className="h-max w-full overflow-visible py-3"
                {...props}
            >
                {tree.map((node) => {
                    if (node.type === "divider") {
                        return (
                            <TocDivider
                                key={`div-${node.id}`}
                                className="ltr:ltr rtl:rtl"
                            />
                        )
                    }

                    if (node.type === "group") {
                        return (
                            <TocGroup
                                key={`group-${node.header.id}`}
                                header={node.header}
                                items={node.items}
                                debouncedQuery={debouncedQuery}
                                onItemPress={handlePress}
                                className="ltr:ltr rtl:rtl"
                            />
                        )
                    }

                    return (
                        <ul
                            key={`anchors-${node.items[0].id}`}
                            className="flex flex-col ltr:ltr rtl:rtl"
                        >
                            {node.items.map((item) => (
                                <TocItemRow
                                    key={item.id}
                                    variant="anchor"
                                    item={item}
                                    query={debouncedQuery}
                                    onPress={handlePress}
                                />
                            ))}
                        </ul>
                    )
                })}
            </LineSidebar>
        </SmoothScrolling>
    )
}

export type { TocListProps }
export { handleItemClick, TocList }
