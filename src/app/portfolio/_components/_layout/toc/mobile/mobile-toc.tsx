"use client"

import { memo, useEffect, useRef, useState } from "react"

import { type Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { sendGAEvent } from "@next/third-parties/google"
import {
    ListDownMinimalisticBoldDuotoneIcon,
    ListUpMinimalisticBoldDuotoneIcon
} from "@solar-icons/react"

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
import { usePreference } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"
import { type MobileTocProps } from "@/portfolio/_components/_layout/toc/mobile"
import { MobileTocList } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-list"
import { TocStoreProvider } from "@/portfolio/_components/_layout/toc/providers/toc-store-provider"
import { useMobileTocStore } from "@/portfolio/_components/_layout/toc/stores/mobile-toc-store"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"

const snapPoints = [0.85, 1]
const EMPTY_ITEMS: TocItemProps[] = []

function MobileToc({
    items: tocItems = EMPTY_ITEMS,
    enableStartEndAutoHighlight
}: MobileTocProps) {
    const isTocOpen = useMobileTocStore((s) => s.isTocOpen)
    const setIsTocOpen = useMobileTocStore((s) => s.setIsTocOpen)

    const inputRef = useRef<HTMLInputElement>(null)
    const {
        query,
        setQuery,
        debouncedQuery,
        filteredItems,
        handleClearSearch
    } = useTocSearch(inputRef, tocItems)

    const { motionReduced } = usePreference()

    const [snapPoint, setSnapPoint] =
        useState<DrawerPrimitive.Root.SnapPoint | null>(snapPoints[0])

    return (
        <TocStoreProvider
            enableStartEndAutoHighlight={enableStartEndAutoHighlight}
            items={tocItems}
            filteredItems={filteredItems}
            query={debouncedQuery}
        >
            <Drawer
                open={isTocOpen}
                snapPoints={snapPoints}
                snapPoint={snapPoint}
                onSnapPointChange={setSnapPoint}
                onOpenChange={setIsTocOpen}
                overlayZIndex={71}
                contentZIndex={72}
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
                                    haptic="nudge"
                                    pressSound={
                                        motionReduced
                                            ? "button"
                                            : isTocOpen
                                              ? "zoom-out"
                                              : "zoom-in"
                                    }
                                    className={cn(
                                        "!size-full !rounded-none border-0"
                                    )}
                                    aria-expanded={isTocOpen}
                                    data-state={isTocOpen ? "open" : "closed"}
                                >
                                    {isTocOpen ? (
                                        <ListDownMinimalisticBoldDuotoneIcon className="size-8" />
                                    ) : (
                                        <ListUpMinimalisticBoldDuotoneIcon className="size-8" />
                                    )}
                                </Button>
                            }
                        />
                    }
                />
                <DrawerContent
                    data-current-snap-points={snapPoint}
                    className="ml-[calc(var(--body-safe-zone-left)-var(--spacing-safe-zone))] mr-[calc(var(--body-safe-zone-right)-var(--spacing-safe-zone))]"
                >
                    <DrawerHeader className="pointer-events-none sticky top-0 p-0">
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
                    <MobileTocNav handleClearSearch={handleClearSearch} />
                </DrawerContent>
            </Drawer>
        </TocStoreProvider>
    )
}

interface MobileTocNavProps extends React.ComponentProps<"nav"> {
    handleClearSearch: () => void
}

const MobileTocNav = memo(
    ({ handleClearSearch, className, ...props }: MobileTocNavProps) => {
        const items = useTocStore((s) => s.items)
        const filteredItems = useTocStore((s) => s.filteredItems)
        const debouncedQuery = useTocStore((s) => s.query)

        useEffect(() => {
            if (debouncedQuery && filteredItems.length === 0) {
                const eventName = "search_toc_no_result"
                const eventParams = { search_query: debouncedQuery }
                sendGAEvent("event", eventName, eventParams)
            }
        }, [debouncedQuery, filteredItems.length])

        if (items.length === 0) return null

        return (
            <nav
                aria-label="Table of contents"
                className={cn(
                    "flex flex-col overflow-auto text-xl",
                    "pb-[--toolbar-height]",
                    className
                )}
                {...props}
            >
                {filteredItems.length === 0 ? (
                    <TocSearchNoResult onClear={handleClearSearch} />
                ) : (
                    <MobileTocList className="scroll-pb-[--toolbar-height]" />
                )}
            </nav>
        )
    }
)
MobileTocNav.displayName = "MobileTocNav"

export default MobileToc
