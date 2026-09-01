"use client"

import { useMemo } from "react"

import { ElementLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Bold } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { TableOfContents } from "@/portfolio/_components/_layout/toc"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"

export interface Heading {
    id: string
    text: string
    level: 1 | 2
}

interface ArticleIndexProps {
    toc: Heading[]
}

function ArticleIndex({ toc }: ArticleIndexProps) {
    const items = useMemo<TocItemProps[]>(
        () =>
            toc.map((h) => ({
                id: h.id,
                label: h.text,
                depth: h.level === 1 ? 2 : 3,
                mode: "anchor" as const,
                kind: "static" as const
            })),
        [toc]
    )

    return (
        <aside
            className={cn(
                "sticky end-[calc(var(--body-safe-zone-left)+var(--px))] top-0 z-[56] order-9 -mt-space flex h-dvh w-sidebar shrink-0 flex-col overscroll-contain bg-background",
                {
                    "group-data-[sidebar-position=inline-end]/html":
                        "end-auto start-[calc(var(--body-safe-zone-left)+var(--px))] order-1",
                    xl: "hidden"
                }
            )}
        >
            <Space className="flex items-center px-safe-zone">
                <Bold mono className="text-sm uppercase text-muted-foreground">
                    In this article
                </Bold>
            </Space>
            <ElementLine dir="horizontal" />
            <TableOfContents
                items={items}
                showSearch={false}
                compact
                labelElement="span"
                enableStartEndAutoHighlight
            />
            <ElementLine dir="horizontal" />
            <Space
                aria-hidden={true}
                className="flex items-center px-safe-zone"
            >
                <Bold mono className="text-sm uppercase text-muted-foreground">
                    In this article
                </Bold>
            </Space>
        </aside>
    )
}

export { ArticleIndex }
