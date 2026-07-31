import { cn } from "@/lib/utils"
import { MobileTocGroup } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-group"
import { MobileTocItemRow } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-item-row"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import {
    handleItemClick,
    handleSameLinkClick,
    type TocListProps
} from "@/portfolio/_components/_layout/toc/toc-list"
import { useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"
import { useTocTree } from "@/portfolio/_hooks/use-toc-tree"

function MobileTocList({
    mode,
    items,
    filteredItems,
    debouncedQuery,
    onLinkClick
}: TocListProps & {
    onLinkClick?: () => void
}) {
    const { scrollContainerRef, clickedTargetRef } = useTocScroll({
        items,
        debouncedQuery
    })

    const tree = useTocTree(filteredItems)

    return (
        <div
            ref={scrollContainerRef}
            className={cn(
                "group overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-5 scrollbar-thin webkit:pointer-events-auto",
                "scroll-fade-y scroll-fade-16"
            )}
        >
            {tree.map((node) => {
                if (node.type === "divider") {
                    return (
                        <TocDivider
                            key={`div-${node.id}`}
                            id={node.id}
                            containerClassName="pointer-events-auto mb-4 mt-4.5 h-px p-0"
                        />
                    )
                }

                if (node.type === "group") {
                    return (
                        <MobileTocGroup
                            key={`group-${node.header.id}`}
                            header={node.header}
                            items={node.items}
                            mode={mode}
                            debouncedQuery={debouncedQuery}
                            onItemPress={(item) => {
                                handleItemClick(item, clickedTargetRef)
                                onLinkClick?.()
                            }}
                            onSameLinkClick={() => {
                                handleSameLinkClick()
                                onLinkClick?.()
                            }}
                        />
                    )
                }

                return (
                    <ul
                        key={`anchors-${node.items[0].id}`}
                        className="flex flex-col"
                    >
                        {node.items.map((item) => (
                            <MobileTocItemRow
                                key={item.id}
                                variant="anchor"
                                mode={mode}
                                item={item}
                                query={debouncedQuery}
                                onPress={(item) => {
                                    handleItemClick(item, clickedTargetRef)
                                    onLinkClick?.()
                                }}
                                onSameLinkClick={() => {
                                    handleSameLinkClick()
                                    onLinkClick?.()
                                }}
                            />
                        ))}
                    </ul>
                )
            })}
            <div className="pointer-events-auto h-[35vh] w-full" />
        </div>
    )
}

export { MobileTocList }
