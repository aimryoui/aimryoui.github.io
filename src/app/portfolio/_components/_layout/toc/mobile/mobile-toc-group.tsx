"use client"

import { memo } from "react"

import { ChevronDown } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { MobileTocItemRow } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-item-row"
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import { useTocGroup } from "@/portfolio/_hooks/use-toc-tree"

interface MobileTocGroupProps {
    header: TocItemProps
    items: TocItemProps[]
    onItemPress: (item: TocItemProps) => void
    collapsible?: boolean
}

const MobileTocGroup = memo(
    ({ header, items, onItemPress, collapsible }: MobileTocGroupProps) => {
        const isDefaultExpanded = header.id !== "selected-works"
        const { isExpanded, setIsExpanded } = useTocGroup(
            items,
            isDefaultExpanded
        )

        const hasActiveChild = useTocStore((s) =>
            s.activeId ? items.some((item) => item.id === s.activeId) : false
        )

        return items.length === 0 || collapsible === false ? (
            <>
                <MobileTocItemRow
                    variant="header"
                    item={header}
                    onPress={onItemPress}
                />
                {items.length > 0 && (
                    <ul className="flex flex-col">
                        {items.map((item) => (
                            <MobileTocItemRow
                                key={item.id}
                                variant="item"
                                item={item}
                                onPress={onItemPress}
                            />
                        ))}
                    </ul>
                )}
            </>
        ) : (
            <Collapsible
                defaultExpanded={isDefaultExpanded}
                isExpanded={isExpanded}
                onExpandedChange={setIsExpanded}
                className="group/collapsible flex flex-col"
            >
                <MobileTocItemRow
                    variant="header"
                    item={header}
                    onPress={onItemPress}
                    activeViaChild={
                        (hasActiveChild && !isExpanded) || undefined
                    }
                >
                    <CollapsibleTrigger
                        haptic={isExpanded ? "light" : "nudge"}
                        pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                        className={cn(
                            "group/collapsibile-trigger -my-2 -me-safe-zone px-safe-zone py-3.5",
                            "group-has-[input:not(:placeholder-shown)]/sidebar:hidden"
                        )}
                    >
                        <div
                            className={cn(
                                "grid size-7 place-items-center rounded-full bg-foreground/40 text-inverted transition-[transform,translate]",
                                {
                                    dark: "bg-foreground/60",
                                    rtl: "-scale-y-100",
                                    "group-hover/collapsibile-trigger":
                                        "bg-foreground/35 data-target-cursor:rounded-none dark:bg-foreground/55",
                                    "group-active/collapsibile-trigger":
                                        "motion-preferred:translate-y-0.5",
                                    "group-focus-visible/collapsibile-trigger":
                                        "bg-foreground/35 data-target-cursor:rounded-none dark:bg-foreground/55",
                                    "group-data-expanded/collapsible": [
                                        "bg-foreground/10 text-muted-foreground",
                                        {
                                            dark: "bg-foreground/15",
                                            "group-hover/collapsibile-trigger":
                                                "bg-foreground/20 text-foreground data-target-cursor:rounded-none dark:bg-foreground/25",
                                            "group-focus-visible/collapsibile-trigger":
                                                "bg-foreground/20 text-foreground dark:bg-foreground/25"
                                        }
                                    ]
                                }
                            )}
                        >
                            <span className="sr-only">
                                {isExpanded ? "Collapse" : "Expand"}{" "}
                                <Highlight>{header.label}</Highlight> category
                            </span>
                            <ChevronDown
                                className={cn("size-6 translate-y-[.5px]", {
                                    "motion-preferred":
                                        "transition-transform duration-350",
                                    rtl: "-translate-y-[.5px] rotate-180",
                                    "group-not-data-expanded/collapsible": [
                                        "translate-x-[1px] translate-y-0 -rotate-90 dark:stroke-2.5",
                                        {
                                            rtl: "-translate-x-[1px] rotate-90"
                                        }
                                    ]
                                })}
                            />
                        </div>
                    </CollapsibleTrigger>
                </MobileTocItemRow>
                <CollapsibleContent>
                    <ul className="flex flex-col">
                        {items.map((item) => (
                            <MobileTocItemRow
                                key={item.id}
                                variant="item"
                                item={item}
                                onPress={onItemPress}
                            />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        )
    }
)
MobileTocGroup.displayName = "MobileTocGroup"

export type { MobileTocGroupProps }
export { MobileTocGroup }
