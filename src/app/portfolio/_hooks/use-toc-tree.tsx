"use client"

import { useEffect, useMemo, useState } from "react"

import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocActiveId } from "@/portfolio/_hooks/use-toc-scroll"

type TocNode =
    | { type: "divider"; id: string }
    | { type: "group"; header: TocItemProps; items: TocItemProps[] }
    | { type: "anchors"; items: TocItemProps[] }

function useTocTree(filteredItems: TocItemProps[]): TocNode[] {
    return useMemo(() => {
        return filteredItems.reduce<TocNode[]>((acc, item) => {
            if (item.hidden) return acc

            const isCollapsible = item.depth === 2 && item.id !== "outlines"
            const isProject = item.depth === 3 && !item.icon

            if (item.depth === 2 || item.depth === 4) {
                acc.push({ type: "divider", id: item.id })
            }

            if (isCollapsible) {
                acc.push({ type: "group", header: item, items: [] })
            } else if (isProject) {
                if (acc.length > 0) {
                    const lastNode = acc[acc.length - 1]
                    if (lastNode.type === "group") {
                        lastNode.items.push(item)
                    }
                }
            } else {
                if (acc.length > 0) {
                    const lastNode = acc[acc.length - 1]
                    if (lastNode.type === "anchors") {
                        lastNode.items.push(item)
                        return acc
                    }
                }
                acc.push({ type: "anchors", items: [item] })
            }

            return acc
        }, [])
    }, [filteredItems])
}

function useTocGroup(headerId: string, items: TocItemProps[]) {
    const [isExpanded, setIsExpanded] = useState(true)

    useEffect(() => {
        const unsubscribe = useTocActiveId.subscribe((state) => {
            const activeId = state.activeId
            if (activeId === headerId || items.some((i) => i.id === activeId)) {
                setIsExpanded(true)
            }
        })
        return unsubscribe
    }, [headerId, items])

    return { isExpanded, setIsExpanded }
}

export type { TocNode }
export { useTocGroup, useTocTree }
