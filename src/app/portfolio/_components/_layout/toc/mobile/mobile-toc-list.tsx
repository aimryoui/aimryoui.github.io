import { Fragment } from "react"

import { cn } from "@/lib/utils"
import { MobileTocItemRow } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-item-row"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import {
    handleItemClick,
    handleSameLinkClick,
    type TocListProps
} from "@/portfolio/_components/_layout/toc/toc-list"
import { useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"

function MobileTocList({
    mode,
    items,
    filteredItems,
    debouncedQuery,
    onLinkClick
}: TocListProps & {
    onLinkClick?: () => void
}) {
    const { scrollContainerRef, clickedTargetRef, activeId } = useTocScroll({
        items,
        debouncedQuery
    })

    return (
        <ul
            ref={scrollContainerRef}
            className={cn(
                "group overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-5 scrollbar-thin",
                "scroll-fade-y scroll-fade-16"
            )}
        >
            {filteredItems.map((item) => {
                if (item.hidden) return null

                return (
                    <Fragment key={item.id}>
                        {(item.depth === 2 || item.depth === 4) && (
                            <TocDivider
                                id={item.id}
                                className="-mx-6 mb-4 mt-4.5"
                            />
                        )}

                        <MobileTocItemRow
                            mode={mode}
                            item={item}
                            isActive={activeId === item.id}
                            query={debouncedQuery}
                            onClick={(item) => {
                                handleItemClick(item, clickedTargetRef)
                                onLinkClick?.()
                            }}
                            onSameLinkClick={() => {
                                handleSameLinkClick()
                                onLinkClick?.()
                            }}
                        />
                    </Fragment>
                )
            })}
            <div className="pointer-events-auto h-[35vh] w-full" />
        </ul>
    )
}

export { MobileTocList }
