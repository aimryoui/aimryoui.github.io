"use client"

import { useRef, useState } from "react"

import { PanelTopClose, PanelTopOpen } from "lucide-react"

import { SectionLine } from "@/components/layout/line"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { MobileTocList } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-list"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"
import {
    type PortfolioMode,
    usePortfolioModeStore
} from "@/stores/portfolio-mode-store"

interface TocProps {
    mode: PortfolioMode
    items: TocItemProps[]
}

function MobileToc({ mode, items }: TocProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const { query, setQuery, filteredItems, handleClearSearch } = useTocSearch(
        inputRef,
        items
    )

    if (items.length === 0) return null

    return (
        <>
            <TocHeader
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onClear={handleClearSearch}
            />
            <SectionLine fit />
            <nav
                aria-label="Table of contents"
                className={cn("flex flex-1 flex-col overflow-auto")}
            >
                {filteredItems.length === 0 ? (
                    <TocSearchNoResult onClear={handleClearSearch} />
                ) : (
                    <MobileTocList
                        mode={mode}
                        items={items}
                        filteredItems={filteredItems}
                    />
                )}
            </nav>
        </>
    )
}

function MobileTocButton() {
    const [isTocOpen, setIsTocOpen] = useState(false)

    const mode = usePortfolioModeStore((state) => state.mode)
    const tocItems = useTocItems(mode)

    return (
        <Drawer onOpenChange={setIsTocOpen}>
            <DrawerTrigger
                render={
                    <TooltipTrigger
                        delay={500}
                        disabled={isTocOpen}
                        payload={{
                            content: <span>Table of Contents</span>
                        }}
                        render={
                            <Button
                                size="icon"
                                variant="outline"
                                className={cn(
                                    "size-full rounded-none border-y-0 border-e-0"
                                )}
                                aria-expanded={isTocOpen}
                                data-state={isTocOpen ? "open" : "closed"}
                            >
                                {isTocOpen ? (
                                    <PanelTopOpen
                                        className="size-8"
                                        strokeWidth={1.25}
                                    />
                                ) : (
                                    <PanelTopClose
                                        className="size-8"
                                        strokeWidth={1.25}
                                    />
                                )}
                                <span className="sr-only">
                                    Table of Contents
                                </span>
                            </Button>
                        }
                    />
                }
            />
            <DrawerContent
                data-cursor="ignore"
                className="h-[85vh] cursor-auto [--drawer-add-bottom-padding:theme(spacing.20)]"
            >
                <DrawerHeader className="sr-only">
                    <DrawerTitle>Table of Contents</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col overflow-hidden text-2xl">
                    <MobileToc mode={mode} items={tocItems} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export { MobileTocButton }
