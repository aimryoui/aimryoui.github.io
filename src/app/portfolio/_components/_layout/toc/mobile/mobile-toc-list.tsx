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
        debouncedQuery,
        scrollParentSelector: "nav"
    })

    return (
        <ul
            ref={scrollContainerRef}
            className={cn("group scroll-auto py-5 pb-[35vh]")}
        >
            {filteredItems.map((item) => {
                if (item.hidden) return null

                return (
                    <Fragment key={item.id}>
                        {(item.depth === 2 || item.depth === 4) && (
                            <TocDivider id={item.id} className="mb-4 mt-4.5" />
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
        </ul>
    )
}

export { MobileTocList }
