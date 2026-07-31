import { memo, useCallback, useMemo, useState } from "react"

import { ChevronDown } from "lucide-react"

import { LineSidebar } from "@/components/animations/line-sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
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

const TocGroup = memo(function TocGroup({
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
    const [isExpanded, setIsExpanded] = useState(true)

    const handleHeaderPress = useCallback(() => {
        onItemPress(header)
    }, [header, onItemPress])

    const activeChildId = useTocActiveId((s) => {
        if (s.activeId === header.id) return s.activeId
        if (items.some((i) => i.id === s.activeId)) return s.activeId
        return null
    })
    const [prevActiveChildId, setPrevActiveChildId] = useState(activeChildId)

    if (activeChildId !== prevActiveChildId) {
        setPrevActiveChildId(activeChildId)
        if (activeChildId !== null && !isExpanded) {
            setIsExpanded(true)
        }
    }

    return (
        <Collapsible
            defaultExpanded
            isExpanded={isExpanded}
            onExpandedChange={setIsExpanded}
            className="group/collapsible flex flex-col"
        >
            <TocItemRow
                mode={mode}
                item={header}
                query={debouncedQuery}
                onPress={handleHeaderPress}
                onSameLinkClick={handleSameLinkClick}
            >
                <TooltipTrigger
                    delay={500}
                    payload={{
                        content: (
                            <span>
                                {isExpanded ? "Collapse" : "Expand"}{" "}
                                <Highlight>{header.label}</Highlight> category
                            </span>
                        ),
                        side: "right",
                        sideOffset: -14
                    }}
                    render={
                        <CollapsibleTrigger
                            pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                            className={cn(
                                "group/collapsibile-trigger pe-5.5 ps-2.5",
                                "group-has-[input:not(:placeholder-shown)]/sidebar:hidden"
                            )}
                        >
                            <div
                                data-cursor="lock"
                                className={cn(
                                    "my-1 grid size-6 place-items-center rounded-[.75rem] !corner-round transition-[border-radius,transform,translate] duration-100",
                                    isExpanded
                                        ? "bg-foreground/10 dark:bg-foreground/15"
                                        : "bg-foreground/40 text-inverted dark:bg-foreground/60",
                                    {
                                        "group-hover/collapsibile-trigger":
                                            "rounded-none duration-200",
                                        "group-active/collapsibile-trigger":
                                            "translate-y-0.5"
                                    }
                                )}
                            >
                                <ChevronDown
                                    className={cn(
                                        "size-5 transition-transform duration-200",
                                        isExpanded
                                            ? "translate-y-[.5px]"
                                            : "translate-x-[.5px] -rotate-90 dark:stroke-2.5"
                                    )}
                                />
                            </div>
                        </CollapsibleTrigger>
                    }
                />
            </TocItemRow>
            <CollapsibleContent>
                <ul className="flex flex-col">
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
            </CollapsibleContent>
        </Collapsible>
    )
})

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
            itemSelector="[data-toc-item]:not([data-expanded='false'] [data-slot='collapsible-content'] *)"
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
