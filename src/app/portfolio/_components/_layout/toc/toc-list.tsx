import { Fragment } from "react"

import { LineSidebar } from "@/components/animations/line-sidebar"
import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocListProps {
    mode: PortfolioMode
    items: TocItemProps[]
    filteredItems: TocItemProps[]
    debouncedQuery: string
}

const handleItemClick = (
    item: TocItemProps,
    clickedTargetRef: React.RefObject<string | null>
) => {
    const targetId = item.id

    if (item.mode === "route") return

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

const SCROLL_DELAY = 400

function TocList({
    mode,
    items,
    filteredItems,
    debouncedQuery,
    onActiveReady
}: TocListProps & {
    onActiveReady?: () => void
}) {
    const { isBlink } = useBrowserEngine()

    const { scrollContainerRef, clickedTargetRef, activeId } = useTocScroll({
        items,
        debouncedQuery,
        delay: isBlink ? SCROLL_DELAY : 0,
        onActiveReady
    })

    return (
        <LineSidebar
            ref={scrollContainerRef}
            itemSelector="li:not([role='separator'])"
            className={cn(
                "group block overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-3",
                "scroll-fade-y scroll-fade-18"
            )}
        >
            {filteredItems.map((item) => {
                if (item.hidden) return null

                return (
                    <Fragment key={item.id}>
                        {(item.depth === 2 || item.depth === 4) && (
                            <TocDivider id={item.id} />
                        )}
                        <TocItemRow
                            mode={mode}
                            item={item}
                            isActive={activeId === item.id}
                            query={debouncedQuery}
                            onClick={() => {
                                handleItemClick(item, clickedTargetRef)
                            }}
                            onSameLinkClick={handleSameLinkClick}
                        />
                    </Fragment>
                )
            })}
        </LineSidebar>
    )
}

export type { TocListProps }
export { handleItemClick, handleSameLinkClick, TocList }
