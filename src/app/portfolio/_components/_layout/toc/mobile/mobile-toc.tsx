"use client"

import { useRef, useState } from "react"

import { type Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
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
import { type TocListProps } from "@/portfolio/_components/_layout/toc/toc-list"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

function MobileToc({
    mode,
    items,
    filteredItems,
    debouncedQuery,
    handleClearSearch,
    onLinkClick
}: TocListProps & {
    handleClearSearch: () => void
    onLinkClick?: () => void
}) {
    if (items.length === 0) return null

    return (
        <nav
            aria-label="Table of contents"
            className={cn("flex flex-1 flex-col overflow-auto scrollbar-thin")}
        >
            {filteredItems.length === 0 ? (
                <TocSearchNoResult onClear={handleClearSearch} />
            ) : (
                <MobileTocList
                    mode={mode}
                    items={items}
                    filteredItems={filteredItems}
                    debouncedQuery={debouncedQuery}
                    onLinkClick={onLinkClick}
                />
            )}
        </nav>
    )
}

const snapPoints = [0.85, 1]

function MobileTocButton() {
    const [isTocOpen, setIsTocOpen] = useState(false)

    const mode = usePortfolioModeStore((state) => state.mode)
    const tocItems = useTocItems(mode)

    const inputRef = useRef<HTMLInputElement>(null)
    const {
        query,
        setQuery,
        debouncedQuery,
        filteredItems,
        handleClearSearch
    } = useTocSearch(inputRef, tocItems)

    const [snapPoint, setSnapPoint] =
        useState<DrawerPrimitive.Root.SnapPoint | null>(snapPoints[0])

    return (
        <Drawer
            open={isTocOpen}
            snapPoints={snapPoints}
            snapPoint={snapPoint}
            onSnapPointChange={setSnapPoint}
            onOpenChange={setIsTocOpen}
        >
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
            <DrawerContent data-current-snap-points={snapPoint}>
                <DrawerHeader className="sticky top-0 p-0">
                    <DrawerTitle className="sr-only">
                        Table of Contents
                    </DrawerTitle>
                    <TocHeader
                        ref={inputRef}
                        value={query}
                        onChange={setQuery}
                        onClear={handleClearSearch}
                    />
                    <SectionLine fit />
                </DrawerHeader>
                <div className="-mb-[--bleed] flex flex-col overflow-hidden pb-[calc(env(safe-area-inset-bottom,0px)+var(--bleed)+theme(spacing.20))] text-2xl">
                    <MobileToc
                        mode={mode}
                        items={tocItems}
                        filteredItems={filteredItems}
                        debouncedQuery={debouncedQuery}
                        handleClearSearch={handleClearSearch}
                        onLinkClick={() => {
                            setIsTocOpen(false)
                        }}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export { MobileTocButton }
