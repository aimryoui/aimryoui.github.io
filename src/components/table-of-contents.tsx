"use client"

import Link from "next/link"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { SectionLine } from "@/components/layout/line"
import { Button } from "@/components/ui/button"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { Highlight, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { usePlatform } from "@/hooks/use-platform"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

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
    const platform = usePlatform()

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

    useHotkeys([["mod + K", () => inputRef.current?.focus()]])

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
    const activeId = useScrollSpy(allIds)

    if (!items.length) return null

    return (
        <aside className={cn("relative h-dvh w-80 lg:hidden")}>
            <nav className="bg-background fixed top-0 z-50 flex h-full w-[inherit] flex-col">
                <div className={cn("px-6 pt-5 pb-2")}>
                    <InputGroup>
                        <InputGroupInput
                            ref={inputRef}
                            id="search"
                            type="search"
                            name="search"
                            placeholder="Search for sections..."
                            autoComplete="off"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    if (query) {
                                        setQuery("")
                                        setDebouncedQuery("")
                                    } else {
                                        inputRef.current?.blur()
                                    }
                                }
                            }}
                            className={cn("text-sm")}
                        />
                        <InputGroupAddon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className={cn("size-4")}
                            >
                                <path
                                    className={cn("fill-muted-foreground")}
                                    d="M1.102 9.99c0-4.959 4.03-8.99 8.99-8.99 4.958 0 8.99 4.031 8.99 8.99 0 1.933-.63 3.722-1.68 5.169l5.048 5.058c.298.31.453.718.453 1.16 0 .916-.674 1.623-1.613 1.623-.43 0-.861-.144-1.17-.464l-5.08-5.08a8.742 8.742 0 0 1-4.948 1.524c-4.96 0-8.99-4.031-8.99-8.99Zm2.297 0c0 3.7 2.993 6.693 6.693 6.693 3.7 0 6.692-2.993 6.692-6.693 0-3.7-2.993-6.693-6.692-6.693A6.688 6.688 0 0 0 3.399 9.99Z"
                                />
                            </svg>
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {query ? (
                                <TooltipProvider
                                    delayDuration={500}
                                    skipDelayDuration={0}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "hover:bg-transparent"
                                                )}
                                                onClick={() => {
                                                    setQuery("")
                                                    setDebouncedQuery("")
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className={cn(
                                                        "size-4 cursor-pointer"
                                                    )}
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 23C5.94 23 1 18.06 1 12 1 5.928 5.94 1 12 1c6.072 0 11 4.928 11 11 0 6.06-4.928 11-11 11Zm-3.624-6.47a.895.895 0 0 0 .648-.26L12 13.274l2.987 2.998a.854.854 0 0 0 .636.258.895.895 0 0 0 .906-.895.824.824 0 0 0-.27-.636l-2.986-2.987 2.998-2.998a.834.834 0 0 0 .27-.637.884.884 0 0 0-.896-.884.816.816 0 0 0-.615.259L12 10.76 8.991 7.762a.855.855 0 0 0-.615-.248.868.868 0 0 0-.884.884c0 .237.086.453.259.626l2.987 2.987-2.987 2.998a.847.847 0 0 0-.259.625c0 .496.388.895.884.895Z"
                                                    />
                                                </svg>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            sideOffset={6}
                                        >
                                            <div className="flex items-center gap-1">
                                                Clear search <Kbd>Esc</Kbd>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <KbdGroup>
                                    <Kbd>
                                        {platform === "mac" ? "⌘" : "Ctrl"}
                                    </Kbd>
                                    <Kbd>K</Kbd>
                                </KbdGroup>
                            )}
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
                                inputRef.current?.focus()
                            }}
                            className={cn(
                                "cursor-pointer decoration-solid hover:underline"
                            )}
                        >
                            Clear search
                        </Highlight>
                    </Text>
                ) : (
                    <ul
                        className="group flex-1 overflow-y-scroll pt-4 pb-20 text-sm"
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
                                            ? "border-muted-foreground/20 border-s-1"
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
                                            "relative inline-block w-full",
                                            item.depth === 3
                                                ? "py-1 ps-3"
                                                : "font-bold"
                                        )}
                                    >
                                        {item.depth === 1
                                            ? "About"
                                            : formatOrdinal(item.label)}
                                        {activeId === item.id && (
                                            <div
                                                className={cn(
                                                    "bg-highlighted/10 text-highlighted absolute top-1/2 right-0 hidden size-5 -translate-y-1/2 place-items-center rounded-full dark:bg-highlighted/20 group-hover:grid"
                                                )}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className={cn("size-3")}
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M11.998 23c-.741 0-1.263-.521-1.263-1.286V7.325l.093-2.502L7.77 8.241l-2.63 2.595c-.22.22-.545.37-.892.37-.695 0-1.217-.532-1.217-1.24 0-.335.128-.636.394-.914l7.635-7.647c.255-.254.59-.405.938-.405s.684.15.939.405l7.634 7.647c.266.278.394.579.394.915 0 .707-.51 1.24-1.205 1.24-.36 0-.672-.151-.904-.371l-2.63-2.595-3.058-3.406.093 2.49v14.39c0 .764-.51 1.285-1.263 1.285Z"
                                                    />
                                                </svg>
                                            </div>
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
