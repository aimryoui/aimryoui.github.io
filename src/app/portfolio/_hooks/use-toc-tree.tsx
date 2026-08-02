"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

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

            if (item.depth === 2) {
                acc.push({ type: "divider", id: item.id })
            } else if (item.depth === 4) {
                let isPreviousDepth4 = false
                if (acc.length > 0) {
                    const lastNode = acc[acc.length - 1]
                    if (lastNode.type === "anchors") {
                        const lastItem =
                            lastNode.items[lastNode.items.length - 1]
                        if (lastItem.depth === 4) {
                            isPreviousDepth4 = true
                        }
                    }
                }

                if (!isPreviousDepth4) {
                    acc.push({ type: "divider", id: item.id })
                }
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

function useTocGroup(items: TocItemProps[], defaultExpanded = true) {
    const pathname = usePathname()
    const [isExpanded, setIsExpanded] = useState(() => {
        if (defaultExpanded) return true
        const activeId = useTocActiveId.getState().activeId
        return items.some((i) => {
            if (i.id !== activeId) return false
            if (i.href?.startsWith("#")) return true
            if (i.href === pathname) return true
            return false
        })
    })

    useEffect(() => {
        const unsubscribe = useTocActiveId.subscribe((state) => {
            const match = items.some((i) => {
                if (i.id !== state.activeId) return false
                if (i.href?.startsWith("#")) return true
                if (i.href === pathname) return true
                return false
            })

            if (match) {
                setIsExpanded(true)
            }
        })
        return unsubscribe
    }, [items, pathname])

    return { isExpanded, setIsExpanded }
}

export type { TocNode }
export { useTocGroup, useTocTree }
