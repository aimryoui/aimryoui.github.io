import type React from "react"
import { useCallback } from "react"

import { type LenisRef } from "lenis/react"

import { SmoothScrolling } from "@/components/animations/smooth-scrolling"
import { cn } from "@/lib/utils"
import { MobileTocGroup } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-group"
import { MobileTocItemRow } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-item-row"
import { useMobileTocStore } from "@/portfolio/_components/_layout/toc/stores/mobile-toc-store"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import {
    handleItemClick,
    type TocListProps
} from "@/portfolio/_components/_layout/toc/toc-list"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import { useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"
import { useTocTree } from "@/portfolio/_hooks/use-toc-tree"

type MobileTocListProps = React.ComponentProps<"div"> & TocListProps

function MobileTocList({ className, ref: _ref, ...props }: MobileTocListProps) {
    const items = useTocStore((s) => s.items)
    const filteredItems = useTocStore((s) => s.filteredItems)
    const debouncedQuery = useTocStore((s) => s.query)

    const { scrollContainerRef, clickedTargetRef, getContainer } =
        useTocScroll<LenisRef>({
            items,
            debouncedQuery
        })

    const tree = useTocTree(filteredItems)

    const handlePress = useCallback(
        (item: TocItemProps) => {
            handleItemClick(item, clickedTargetRef, getContainer())
            useMobileTocStore.getState().setIsTocOpen(false)
        },
        [clickedTargetRef, getContainer]
    )

    return (
        <SmoothScrolling
            ref={scrollContainerRef}
            className={cn(
                "group overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-2 scrollbar-thin webkit:pointer-events-auto",
                "scroll-fade-y scroll-fade-16 group-has-[input:not(:placeholder-shown)]/sidebar:scroll-fade-none",
                className
            )}
            {...props}
        >
            {tree.map((node) => {
                if (node.type === "divider") {
                    return (
                        <TocDivider
                            key={`div-${node.id}`}
                            containerClassName="pointer-events-auto my-2 h-px p-0"
                        />
                    )
                }

                if (node.type === "group") {
                    return (
                        <MobileTocGroup
                            key={`group-${node.header.id}`}
                            header={node.header}
                            items={node.items}
                            onItemPress={handlePress}
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
                                item={item}
                                onPress={(item) => {
                                    handleItemClick(
                                        item,
                                        clickedTargetRef,
                                        getContainer()
                                    )
                                    useMobileTocStore
                                        .getState()
                                        .setIsTocOpen(false)
                                }}
                            />
                        ))}
                    </ul>
                )
            })}
            <div className="pointer-events-auto h-[35vh] w-full" />
        </SmoothScrolling>
    )
}

export { MobileTocList }
