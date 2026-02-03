"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const BREAKPOINTS = [
    { key: "sm", query: "(max-width: 40rem)" }, // 640px
    { key: "md", query: "(max-width: 48rem)" }, // 768px
    { key: "lg", query: "(max-width: 64rem)" }, // 1024px
    { key: "xl", query: "(max-width: 80rem)" }, // 1280px
    { key: "2xl", query: "(max-width: 96rem)" } // 1536px
] as const
type BreakpointKey = (typeof BREAKPOINTS)[number]["key"]

interface MasonryProps {
    children: React.ReactNode
    cols?: Partial<Record<BreakpointKey, number>>
    defaultColumns?: number
    className?: string
}

export function Masonry({
    children,
    cols = { md: 1 },
    defaultColumns = 3,
    className
}: MasonryProps) {
    const [columns, setColumns] = useState(defaultColumns)

    useEffect(() => {
        const mediaQueries = BREAKPOINTS.map(({ query }) =>
            window.matchMedia(query)
        )

        const updateColumns = () => {
            let activeCols = defaultColumns

            for (let i = 0; i < BREAKPOINTS.length; i++) {
                const { key } = BREAKPOINTS[i]
                const mq = mediaQueries[i]

                if (mq.matches && cols[key] !== undefined) {
                    activeCols = cols[key]!
                    break
                }
            }
            setColumns(activeCols)
        }

        updateColumns()

        const handler = () => {
            updateColumns()
        }
        mediaQueries.forEach((mq) => {
            mq.addEventListener("change", handler)
        })

        return () => {
            mediaQueries.forEach((mq) => {
                mq.removeEventListener("change", handler)
            })
        }
    }, [cols, defaultColumns])

    const columnWrapper: React.ReactNode[][] = Array.from(
        { length: columns },
        () => []
    )

    React.Children.forEach(children, (child, i) => {
        if (React.isValidElement(child)) {
            columnWrapper[i % columns].push(child)
        }
    })

    return (
        <div className={cn("flex w-full gap-2", className)}>
            {columnWrapper.map((colItems, colIndex) => (
                <div
                    key={colIndex}
                    className={cn("flex flex-1 flex-col gap-2")}
                >
                    {colItems.map((item, itemIndex) => {
                        const masonryIndex = `${colIndex.toString()} ${itemIndex.toString()}`
                        return (
                            <div
                                key={masonryIndex}
                                data-masonry-index={masonryIndex}
                            >
                                {item}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
