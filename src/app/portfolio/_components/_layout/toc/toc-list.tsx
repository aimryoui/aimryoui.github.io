import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { LineSidebar } from "@/components/animations/line-sidebar"
import { cn } from "@/lib/utils"
import { TocDivider } from "@/portfolio/_components/_layout/toc/toc-divider"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocActiveId, useTocScroll } from "@/portfolio/_hooks/use-toc-scroll"
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

const TocGroup = memo(
    function TocGroup({
        header,
        items,
        mode,
        debouncedQuery,
        onItemPress
    }: {
        header: TocItemProps
        items: TocItemProps[]
        mode: PortfolioMode
        debouncedQuery: string
        onItemPress: (item: TocItemProps) => void
    }) {
        const [isCollapsed, setIsCollapsed] = useState(false)

        const handleToggle = useCallback(() => {
            setIsCollapsed((prev) => !prev)
        }, [])

        const handleHeaderPress = useCallback(() => {
            onItemPress(header)
        }, [header, onItemPress])

        const activeChildId = useTocActiveId((s) => {
            if (s.activeId === header.id) return s.activeId
            if (items.some((i) => i.id === s.activeId)) return s.activeId
            return null
        })
        const [prevActiveChildId, setPrevActiveChildId] =
            useState(activeChildId)

        if (activeChildId !== prevActiveChildId) {
            setPrevActiveChildId(activeChildId)
            if (activeChildId !== null && isCollapsed) {
                setIsCollapsed(false)
            }
        }

        const groupListRef = useRef<HTMLUListElement>(null)

        // Accessibility for browser searching (Ctrl+F)
        useEffect(() => {
            const el = groupListRef.current
            if (!el) return

            const handleBeforeMatch = () => {
                setIsCollapsed(false)
            }

            el.addEventListener("beforematch", handleBeforeMatch)
            return () => {
                el.removeEventListener("beforematch", handleBeforeMatch)
            }
        }, [])
        useEffect(() => {
            const el = groupListRef.current
            if (!el) return

            if (!isCollapsed) {
                el.removeAttribute("hidden")
            }
        }, [isCollapsed])

        return (
            <div className="flex flex-col">
                <TocItemRow
                    mode={mode}
                    item={header}
                    query={debouncedQuery}
                    isCollapsed={isCollapsed}
                    onToggle={handleToggle}
                    onPress={handleHeaderPress}
                    onSameLinkClick={handleSameLinkClick}
                />
                <div
                    onTransitionEnd={(e) => {
                        if (e.propertyName === "grid-template-rows") {
                            window.dispatchEvent(
                                new CustomEvent(
                                    "portfolio:sidebar-layout-changed"
                                )
                            )
                            /** @see {@link https://github.com/react/react/issues/24740} */
                            if (isCollapsed && groupListRef.current) {
                                groupListRef.current.setAttribute(
                                    "hidden",
                                    "until-found"
                                )
                            }
                        }
                    }}
                    className={cn(
                        "grid will-change-[grid-template-rows] transition-[grid-template-rows] ease-spring duration-250",
                        isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                    )}
                >
                    <ul
                        ref={groupListRef}
                        data-toc-group-list
                        className="flex flex-col overflow-hidden"
                    >
                        {items.map((item) => (
                            <TocItemRow
                                key={item.id}
                                mode={mode}
                                item={item}
                                query={debouncedQuery}
                                onPress={onItemPress}
                                onSameLinkClick={handleSameLinkClick}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
)

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

    type GroupedData =
        | { type: "divider"; id: string }
        | { type: "group"; header: TocItemProps; items: TocItemProps[] }
        | { type: "item"; item: TocItemProps }

    const groupedData = useMemo(() => {
        const groups: GroupedData[] = []
        let currentGroup: {
            header: TocItemProps
            items: TocItemProps[]
        } | null = null

        const flushGroup = () => {
            if (currentGroup) {
                groups.push({
                    type: "group",
                    header: currentGroup.header,
                    items: currentGroup.items
                })
                currentGroup = null
            }
        }

        for (const item of filteredItems) {
            if (item.hidden) continue

            const isCollapsible = item.depth === 2 && item.id !== "outlines"
            const isProject = item.depth === 3 && !item.icon

            if (item.depth === 2 || item.depth === 4) {
                flushGroup()
                groups.push({ type: "divider", id: item.id })
            }

            if (isCollapsible) {
                flushGroup()
                currentGroup = { header: item, items: [] }
            } else if (isProject && currentGroup) {
                currentGroup.items.push(item)
            } else {
                flushGroup()
                groups.push({ type: "item", item })
            }
        }

        flushGroup()

        return groups
    }, [filteredItems])

    const groupedElements = useMemo(() => {
        return groupedData.map((data) => {
            if (data.type === "divider") {
                return <TocDivider key={`div-${data.id}`} />
            }
            if (data.type === "group") {
                return (
                    <TocGroup
                        key={`group-${data.header.id}`}
                        header={data.header}
                        items={data.items}
                        mode={mode}
                        debouncedQuery={debouncedQuery}
                        onItemPress={handlePress}
                    />
                )
            }
            return (
                <TocItemRow
                    key={data.item.id}
                    mode={mode}
                    item={data.item}
                    query={debouncedQuery}
                    onPress={handlePress}
                    onSameLinkClick={handleSameLinkClick}
                />
            )
        })
    }, [groupedData, mode, debouncedQuery, handlePress])

    return (
        <LineSidebar
            ref={scrollContainerRef}
            itemSelector="[data-toc-item]"
            className={cn(
                "group block overflow-x-hidden overflow-y-scroll overscroll-contain scroll-auto py-3",
                "scroll-fade-y scroll-fade-18"
            )}
        >
            {groupedElements}
        </LineSidebar>
    )
}

export type { TocListProps }
export { handleItemClick, handleSameLinkClick, TocList }
