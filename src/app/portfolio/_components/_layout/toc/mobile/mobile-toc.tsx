"use client"

import { useEffect, useRef, useState } from "react"

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
import { useIsMounted } from "@/hooks/use-is-mounted"
import { usePreference } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"
import { MobileTocList } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-list"
import { TocHeader } from "@/portfolio/_components/_layout/toc/toc-header"
import { type TocListProps } from "@/portfolio/_components/_layout/toc/toc-list"
import { TocSearchNoResult } from "@/portfolio/_components/_layout/toc/toc-search"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"
import { useTocSearch } from "@/portfolio/_hooks/use-toc-search"

function MobileToc({
    items,
    filteredItems,
    debouncedQuery,
    handleClearSearch,
    onLinkClick
}: TocListProps & {
    handleClearSearch: () => void
    onLinkClick?: () => void
}) {
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
                "[--safe-area-inset:calc(env(safe-area-inset-bottom,0px)+var(--spacing-space))]",
                "flex flex-col overflow-auto text-xl",
                "pb-[--safe-area-inset]"
            )}
        >
            {filteredItems.length === 0 ? (
                <TocSearchNoResult onClear={handleClearSearch} />
            ) : (
                <MobileTocList
                    items={items}
                    filteredItems={filteredItems}
                    debouncedQuery={debouncedQuery}
                    onLinkClick={onLinkClick}
                    className="scroll-pb-[--safe-area-inset]"
                />
            )}
        </nav>
    )
}

const snapPoints = [0.85, 1]

function MobileTocButtonCore() {
    const [isTocOpen, setIsTocOpen] = useState(false)

    const tocItems = useTocItems()

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
            <DrawerContent data-current-snap-points={snapPoint}>
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
                <MobileToc
                    items={tocItems}
                    filteredItems={filteredItems}
                    debouncedQuery={debouncedQuery}
                    handleClearSearch={handleClearSearch}
                    onLinkClick={() => {
                        setIsTocOpen(false)
                    }}
                />
            </DrawerContent>
        </Drawer>
    )
}

function MobileTocButton() {
    const isMounted = useIsMounted()

    return isMounted ? (
        <MobileTocButtonCore />
    ) : (
        <Button
            size="icon"
            variant="outline"
            haptic={undefined}
            isDisabled={true}
            className={cn("!size-full !rounded-none border-0")}
            aria-expanded={false}
            data-state="closed"
        >
            <ListUpMinimalisticBoldDuotoneIcon className="size-8" />
            <span className="sr-only">Table of Contents</span>
        </Button>
    )
}

export { MobileTocButton }
