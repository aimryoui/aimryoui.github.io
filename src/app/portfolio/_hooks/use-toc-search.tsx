import { removeDiacritics } from "@/helpers/remove-diacritics"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useSearch } from "@/portfolio/_hooks/use-search"

interface NormalizedTocItem extends TocItemProps {
    _normalizedLabel: string
}

function getFilteredItems(normalizedItems: NormalizedTocItem[], query: string) {
    if (!query.trim()) return normalizedItems

    const normalizedQuery = removeDiacritics(query.toLowerCase().trim())
    const result: TocItemProps[] = []
    let currentCategory: NormalizedTocItem | null = null
    let currentChildren: NormalizedTocItem[] = []

    const flushGroup = () => {
        if (currentCategory) {
            const isCategoryMatch =
                currentCategory._normalizedLabel.includes(normalizedQuery)
            const matchingChildren = currentChildren.filter((child) =>
                child._normalizedLabel.includes(normalizedQuery)
            )

            if (isCategoryMatch || matchingChildren.length > 0) {
                result.push(currentCategory)
                result.push(...matchingChildren)
            }
        }
        currentCategory = null
        currentChildren = []
    }

    for (const item of normalizedItems) {
        if (item.hidden) continue

        if (item.depth === 1 || item.depth === 2) {
            flushGroup()
            currentCategory = item
        } else if (currentCategory) {
            currentChildren.push(item)
        } else {
            flushGroup()
            if (item._normalizedLabel.includes(normalizedQuery)) {
                result.push(item)
            }
        }
    }
    flushGroup()

    return result
}

function useTocSearch(
    inputRef: React.RefObject<HTMLInputElement | null>,
    items: TocItemProps[]
) {
    const { query, setQuery, debouncedQuery, handleClearSearch } =
        useSearch(inputRef)

    const normalizedItems = items.length
        ? items.map((item) => ({
              ...item,
              _normalizedLabel: removeDiacritics(item.label.toLowerCase())
          }))
        : []

    const filteredItems = items.length
        ? getFilteredItems(normalizedItems, debouncedQuery)
        : []

    return {
        query,
        setQuery,
        debouncedQuery,
        filteredItems,
        handleClearSearch
    }
}

export { useTocSearch }
