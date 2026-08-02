import { useCallback } from "react"

import { LineSidebar } from "@/components/animations/line-sidebar"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import { TocGroup } from "@/portfolio/_components/_layout/toc/toc-group"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"
import { useTocTree } from "@/portfolio/_hooks/use-toc-tree"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocListProps {
    mode: PortfolioMode
    items: TocItemProps[]
    filteredItems: TocItemProps[]
    debouncedQuery: string
}

function handleItemClick(
    item: TocItemProps,
    clickedTargetRef: React.RefObject<string | null>
) {
    const targetId = item.id

    clickedTargetRef.current = targetId
    const el = document.getElementById(targetId)
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    window.history.pushState(null, "", `#${targetId}`)
}

function handleSameLinkClick() {
    window.dispatchEvent(new CustomEvent("portfolio:main-flash"))
}

function TocList({
    mode,
    items,
    filteredItems,
    debouncedQuery,
    onActiveReady
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
            handleItemClick(item, clickedTargetRef)
        },
        [clickedTargetRef]
    )

    const tree = useTocTree(filteredItems)

    return (
        <LineSidebar
            ref={scrollContainerRef}
            itemSelector="[data-toc-item]:not([data-expanded='false'] [data-slot='collapsible-content'] *)"
            className={cn(
                "group block overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-3",
                "scroll-fade-y scroll-fade-18"
            )}
        >
            {tree.map((node) => {
                if (node.type === "divider") {
                    return <TocDivider key={`div-${node.id}`} />
                }

                if (node.type === "group") {
                    return (
                        <TocGroup
                            key={`group-${node.header.id}`}
                            header={node.header}
                            items={node.items}
                            mode={mode}
                            debouncedQuery={debouncedQuery}
                            onItemPress={handlePress}
                            onSameLinkClick={handleSameLinkClick}
                        />
                    )
                }

                return (
                    <ul
                        key={`anchors-${node.items[0].id}`}
                        className="flex flex-col"
                    >
                        {node.items.map((item) => (
                            <TocItemRow
                                key={item.id}
                                variant="anchor"
                                mode={mode}
                                item={item}
                                query={debouncedQuery}
                                onPress={handlePress}
                                onSameLinkClick={handleSameLinkClick}
                            />
                        ))}
                    </ul>
                )
            })}
        </LineSidebar>
    )
}

export type { TocListProps }
export { handleItemClick, handleSameLinkClick, TocList }
