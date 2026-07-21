"use client"

import { useEffect, useState } from "react"

const SEARCH_DELAY = 500

function useSearch(
    inputRef: React.RefObject<HTMLInputElement | null>,
    initialValue = ""
) {
    const [query, setQuery] = useState(initialValue)
    const [debouncedQuery, setDebouncedQuery] = useState(initialValue)

    useEffect(() => {
        const delay = query.length === 0 ? 0 : SEARCH_DELAY
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [query])

    const handleClearSearch = () => {
        setQuery("")
        inputRef.current?.focus()
    }

    return {
        query,
        setQuery,
        debouncedQuery,
        handleClearSearch
    }
}

export { useSearch }
