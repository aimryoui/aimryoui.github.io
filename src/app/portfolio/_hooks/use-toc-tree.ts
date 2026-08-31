import { useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import {
    useTocStore,
    useTocStoreApi
} from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
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
            const isItem = item.depth === 3 && !item.icon

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
            } else if (isItem) {
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

function isItemActive(
    item: TocItemProps,
    activeId: string | null,
    pathname: string,
    isFeatureSelected: boolean
) {
    if (item.id !== activeId) return false
    if (item.href?.startsWith("#")) return true
    const hrefPathname = item.href?.split("?")[0]
    if (hrefPathname !== pathname) return false
    const hrefHasFeature = item.href?.includes("feature=selected") ?? false
    return hrefHasFeature === isFeatureSelected
}

function checkGroupActive(
    items: TocItemProps[],
    activeId: string | null,
    pathname: string,
    isFeatureSelected: boolean
) {
    return items.some((item) =>
        isItemActive(item, activeId, pathname, isFeatureSelected)
    )
}

function useTocGroup(items: TocItemProps[], defaultExpanded = true) {
    const pathname = usePathname()
    const isFeatureSelected = useQueryStore((s) => s.isFeatureSelected)
    const store = useTocStoreApi()
    const query = useTocStore((s) => s.query)

    const [isExpanded, setIsExpanded] = useState(() => {
        if (query && items.length > 0) return true
        if (defaultExpanded) return true
        return checkGroupActive(
            items,
            store.getState().activeId,
            pathname,
            isFeatureSelected
        )
    })

    const wasSearchingRef = useRef(!!query)

    useIsomorphicLayoutEffect(() => {
        if (query) {
            wasSearchingRef.current = true
            if (items.length > 0) setIsExpanded(true)
        } else if (wasSearchingRef.current) {
            wasSearchingRef.current = false
            setIsExpanded(
                defaultExpanded
                    || checkGroupActive(
                        items,
                        store.getState().activeId,
                        pathname,
                        isFeatureSelected
                    )
            )
        }
    }, [query, items, defaultExpanded, pathname, isFeatureSelected, store])

    useIsomorphicLayoutEffect(() => {
        const handleActiveCheck = (activeId: string | null) => {
            if (wasSearchingRef.current) return
            if (
                checkGroupActive(items, activeId, pathname, isFeatureSelected)
            ) {
                setIsExpanded(true)
            }
        }

        handleActiveCheck(store.getState().activeId)
        return store.subscribe((state) => {
            handleActiveCheck(state.activeId)
        })
    }, [items, pathname, isFeatureSelected, store])

    return { isExpanded, setIsExpanded }
}

export type { TocNode }
export { useTocGroup, useTocTree }
