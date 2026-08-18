import { useCallback } from "react"

import {
    LineSidebar,
    type LineSidebarProps
} from "@/components/animations/line-sidebar"
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
            tocEl.scrollIntoView({ block: "center", behavior: "smooth" })
        }
    } else {
        // Anchor mode: scroll page to the heading element
        clickedTargetRef.current = targetId
        const el = document.getElementById(targetId)
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        window.history.pushState(null, "", `#${targetId}`)
    }
}

function handleSameLinkClick() {
    window.dispatchEvent(new CustomEvent("portfolio:main-flash"))
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
        <LineSidebar
            ref={scrollContainerRef}
            itemSelector="[data-toc-item]"
            className={cn(
                "group overflow-x-hidden overflow-y-scroll scroll-auto py-3 rtl scrollbar-none",
                "scroll-fade-y scroll-fade-18",
                "hover:scrollbar-thin group-data-[sidebar-position=left]/html:ltr",
                className
            )}
            {...props}
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
                            debouncedQuery={debouncedQuery}
                            onItemPress={handlePress}
                            onSameLinkClick={handleSameLinkClick}
                            className="ltr"
                        />
                    )
                }

                return (
                    <ul
                        key={`anchors-${node.items[0].id}`}
                        className="flex flex-col ltr"
                    >
                        {node.items.map((item) => (
                            <TocItemRow
                                key={item.id}
                                variant="anchor"
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
