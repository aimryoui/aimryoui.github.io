"use client"

import { SearchIcon } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { formatOrdinal } from "@/helpers/format-ordinal"
import { useActiveSpy } from "@/hooks/use-active-spy"
import { cn } from "@/lib/utils"

import { SectionLine } from "./layout/line"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Kbd } from "./ui/kbd"
import { Highlight, Text } from "./ui/typography"

interface TocItem {
    id: string
    label: string
    depth: 1 | 2 | 3
}

interface TableOfContentsProps {
    items: TocItem[]
}

function removeAccents(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)
    const SEARCH_DELAY = 500

    useEffect(() => {
        const delay = query.length === 0 ? 0 : SEARCH_DELAY

        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [query])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const filteredItems = useMemo(() => {
        if (!debouncedQuery.trim()) return items

        const normalizedQuery = removeAccents(
            debouncedQuery.toLowerCase().trim()
        )

        const result: TocItem[] = []
        let currentCategory: TocItem | null = null
        let currentChildren: TocItem[] = []

        const flushGroup = () => {
            if (currentCategory) {
                const isCategoryMatch = removeAccents(
                    currentCategory.label.toLowerCase()
                ).includes(normalizedQuery)
                const matchingChildren = currentChildren.filter((child) =>
                    removeAccents(child.label.toLowerCase()).includes(
                        normalizedQuery
                    )
                )

                if (isCategoryMatch || matchingChildren.length > 0) {
                    result.push(currentCategory)
                    result.push(...matchingChildren)
                }
            }
            currentCategory = null
            currentChildren = []
        }

        for (const item of items) {
            if (item.depth === 1 || item.depth === 2) {
                flushGroup()
                currentCategory = item
            } else if (currentCategory) {
                currentChildren.push(item)
            } else {
                flushGroup()
                if (
                    removeAccents(item.label.toLowerCase()).includes(
                        normalizedQuery
                    )
                ) {
                    result.push(item)
                }
            }
        }
        flushGroup()

        return result
    }, [debouncedQuery, items])

    const allIds = useMemo(() => items.map((item) => item.id), [items])
    const activeId = useActiveSpy(allIds)

    if (!items.length) return null

    return (
        <aside className={cn("relative h-dvh w-72 md:hidden")}>
            <nav className="bg-background fixed top-0 z-50 flex h-full w-72 flex-col">
                <div className={cn("px-6 pt-5 pb-2")}>
                    <InputGroup>
                        <InputGroupInput
                            ref={inputRef}
                            id="search"
                            type="search"
                            placeholder="Search for sections..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    // Nếu đang có chữ thì xóa chữ trước
                                    if (query) {
                                        setQuery("")
                                        setDebouncedQuery("")
                                    } else {
                                        // Nếu rỗng thì blur (thoát focus)
                                        inputRef.current?.blur()
                                    }
                                }
                            }}
                            className={cn("text-sm")}
                        />
                        <InputGroupAddon>
                            <SearchIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <Kbd>⌘K</Kbd>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <SectionLine fit parentClassName={cn("mt-4")} />
                {filteredItems.length === 0 ? (
                    <Text className={cn("px-6 py-4 text-sm")}>
                        No results found.{" "}
                        <Highlight
                            onClick={() => {
                                setQuery("")
                                inputRef.current?.focus() // Xóa xong vẫn giữ focus để nhập tiếp
                            }}
                            className={cn(
                                "cursor-pointer decoration-solid hover:underline"
                            )}
                        >
                            Clear search.
                        </Highlight>
                    </Text>
                ) : (
                    <ul
                        className="flex-1 overflow-y-scroll pt-4 pb-20 text-sm"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        {filteredItems.map((item) => (
                            <React.Fragment key={item.id}>
                                {item.depth === 2 && (
                                    <SectionLine
                                        fit
                                        parentClassName={cn(
                                            "my-4 first:hidden"
                                        )}
                                    />
                                )}
                                <li
                                    className={cn(
                                        item.depth === 3
                                            ? "border-muted-foreground/20 border-s-1 ps-3"
                                            : "mb-2",
                                        "mx-6 box-content h-fit list-inside",
                                        item.depth === 3 &&
                                            activeId === item.id &&
                                            "border-highlighted"
                                    )}
                                >
                                    <Link
                                        href={`#${item.id}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            const targetId = item.id
                                            const el =
                                                document.getElementById(
                                                    targetId
                                                )
                                            if (el) {
                                                el.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start"
                                                })
                                            }
                                            window.history.pushState(
                                                null,
                                                "",
                                                `#${targetId}`
                                            )
                                        }}
                                        className={cn(
                                            activeId === item.id
                                                ? "text-highlighted"
                                                : "hover:text-foreground transition-colors duration-100",
                                            "inline-block w-full",
                                            item.depth === 3
                                                ? "py-1"
                                                : "font-bold"
                                        )}
                                    >
                                        {item.depth === 1
                                            ? "About"
                                            : formatOrdinal(
                                                  item.label
                                                      .replace(/^\d+\.\s*/, "")
                                                      .replace(
                                                          /\.$/,
                                                          (match) => {
                                                              const text =
                                                                  item.label
                                                                      .replace(
                                                                          /^\d+\.\s*/,
                                                                          ""
                                                                      )
                                                                      .slice(
                                                                          0,
                                                                          -1
                                                                      )
                                                                      .toLowerCase()
                                                              return /^(mr|ms|mrs|dr|jr)$/.test(
                                                                  text
                                                              )
                                                                  ? match
                                                                  : ""
                                                          }
                                                      )
                                              )}
                                    </Link>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                )}
            </nav>
        </aside>
    )
}
