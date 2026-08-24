import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocActiveId } from "@/portfolio/_hooks/use-toc-scroll"
import { useQueryStore } from "@/stores/query-store"

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
    const isFeatureSelected = useQueryStore((s) => s.isFeatureSelected)

    const [isExpanded, setIsExpanded] = useState(() => {
        if (defaultExpanded) return true
        const activeId = useTocActiveId.getState().activeId
        return items.some((i) => {
            if (i.id !== activeId) return false
            if (i.href?.startsWith("#")) return true
            // Match pathname AND feature param to ensure only the correct group expands.
            // e.g. when ?feature=selected, only the Selected Works item matches;
            // the regular category item (no query) does NOT expand.
            const hrefPathname = i.href?.split("?")[0]
            if (hrefPathname !== pathname) return false
            const hrefHasFeature = i.href?.includes("feature=selected") ?? false
            return hrefHasFeature === isFeatureSelected
        })
    })

    useIsomorphicLayoutEffect(() => {
        const checkActive = (activeId: string | null) => {
            const match = items.some((i) => {
                if (i.id !== activeId) return false
                if (i.href?.startsWith("#")) return true
                const hrefPathname = i.href?.split("?")[0]
                if (hrefPathname !== pathname) return false
                const hrefHasFeature =
                    i.href?.includes("feature=selected") ?? false
                return hrefHasFeature === isFeatureSelected
            })

            if (match) {
                setIsExpanded(true)
            }
        }

        checkActive(useTocActiveId.getState().activeId)

        const unsubscribe = useTocActiveId.subscribe((state) => {
            checkActive(state.activeId)
        })
        return unsubscribe
    }, [items, pathname, isFeatureSelected])

    return { isExpanded, setIsExpanded }
}

export type { TocNode }
export { useTocGroup, useTocTree }
