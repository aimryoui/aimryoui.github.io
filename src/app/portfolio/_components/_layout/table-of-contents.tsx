"use client"

import { motion, stagger } from "motion/react"
import Link from "next/link"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { TocSearch } from "@/app/portfolio/_components/_layout/toc-search"
import { SectionLine } from "@/components/layout/line"
import { Highlight, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
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
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)
    const scrollContainerRef = useRef<HTMLUListElement>(null)
    const clickedTargetRef = useRef<string | null>(null)

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

    const handleClearSearch = () => {
        setQuery("")
        setDebouncedQuery("")
        inputRef.current?.focus()
    }

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

    const isFirstRenderRef = useRef(true)

    useEffect(() => {
        if (activeId && scrollContainerRef.current) {
            // Logic Target Locking (giữ nguyên)
            if (clickedTargetRef.current) {
                if (activeId !== clickedTargetRef.current) {
                    return
                }
                clickedTargetRef.current = null
            }

            const activeElement = scrollContainerRef.current.querySelector(
                `[data-toc-id="${activeId}"]`
            )

            if (activeElement) {
                // 2. Logic kiểm tra lần đầu
                if (isFirstRenderRef.current) {
                    // Nếu là lần đầu: Tắt cờ và cuộn "tức thời" (auto)
                    isFirstRenderRef.current = false
                    activeElement.scrollIntoView({
                        block: "center",
                        behavior: "auto" // Thay vì smooth, dùng auto để không có animation
                    })
                } else {
                    // Nếu không phải lần đầu: Cuộn mượt (smooth)
                    activeElement.scrollIntoView({
                        block: "center",
                        behavior: "smooth"
                    })
                }
            }
        }
    }, [activeId])

    if (!items.length) return null

    const MotionSectionLine = motion.create(SectionLine)

    return (
        <nav className="bg-background w-inherit fixed top-0 flex h-[calc(100%-(var(--spacing)*20))] flex-col">
            <TocSearch
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onClear={handleClearSearch}
            />

            <SectionLine fit containerClassName={cn("mt-4")} />

            {filteredItems.length === 0 ? (
                <Text className={cn("px-6 py-4 text-sm")}>
                    No results found.{" "}
                    <Highlight
                        onClick={handleClearSearch}
                        className={cn(
                            "cursor-pointer decoration-solid hover:underline"
                        )}
                    >
                        Clear search
                    </Highlight>
                </Text>
            ) : (
                <motion.ul
                    variants={{
                        hidden: {
                            opacity: 0
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                duration: 1,
                                delayChildren: stagger(0.025, {
                                    startDelay: -0.1,
                                    ease: "easeOut"
                                })
                            }
                        }
                    }}
                    initial="hidden"
                    animate="visible"
                    ref={scrollContainerRef}
                    className={cn(
                        "group scrollbar-thin flex-1 overflow-y-scroll overscroll-contain scroll-auto py-4 text-sm will-change-[opacity]"
                    )}
                >
                    {filteredItems.map((item) => (
                        <React.Fragment key={item.id}>
                            {item.depth === 2 && (
                                <MotionSectionLine
                                    variants={{
                                        hidden: {
                                            opacity: 0
                                        },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                duration: 0.25
                                            }
                                        }
                                    }}
                                    fit
                                    containerClassName={cn(
                                        "my-4 will-change-[opacity] first:hidden"
                                    )}
                                />
                            )}
                            <motion.li
                                variants={{
                                    hidden: {
                                        x: "10px",
                                        opacity: 0
                                    },
                                    visible: {
                                        x: 0,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.3,
                                            bounce: 0
                                        }
                                    }
                                }}
                                className={cn(
                                    item.depth === 3
                                        ? "border-muted-foreground/20 border-s-[.0625rem]"
                                        : "mb-2",
                                    "mx-6 box-content h-fit list-inside will-change-[translate,opacity,border,margin]",
                                    item.depth === 3 &&
                                        activeId === item.id &&
                                        "border-highlighted -translate-x-0.5 border-s-3"
                                )}
                            >
                                <Link
                                    href={`#${item.id}`}
                                    data-toc-id={item.id}
                                    onClick={(e) => {
                                        e.preventDefault()

                                        clickedTargetRef.current = item.id

                                        const targetId = item.id
                                        const el =
                                            document.getElementById(targetId)
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
                                            : "hover:text-foreground hover:transition-none transition-[color] duration-50",
                                        "relative inline-block w-full will-change-[color]",
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
                            </motion.li>
                        </React.Fragment>
                    ))}
                </motion.ul>
            )}
        </nav>
    )
}
