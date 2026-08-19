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
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocGroup } from "@/portfolio/_hooks/use-toc-tree"

interface MobileTocGroupProps {
    header: TocItemProps
    items: TocItemProps[]
    debouncedQuery: string
    onItemPress: (item: TocItemProps) => void
    onSameLinkClick: () => void
    onLinkClick?: () => void
}

const MobileTocGroup = memo(
    ({
        header,
        items,
        debouncedQuery,
        onItemPress,
        onSameLinkClick,
        onLinkClick
    }: MobileTocGroupProps) => {
        const isDefaultExpanded = header.id !== "selected-works"
        const { isExpanded, setIsExpanded } = useTocGroup(
            items,
            isDefaultExpanded
        )

        return (
            <Collapsible
                defaultExpanded={isDefaultExpanded}
                isExpanded={isExpanded}
                onExpandedChange={setIsExpanded}
                className="group/collapsible flex flex-col"
            >
                <MobileTocItemRow
                    variant="category"
                    item={header}
                    query={debouncedQuery}
                    onPress={onItemPress}
                    onSameLinkClick={onSameLinkClick}
                    onLinkClick={onLinkClick}
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
                                "grid size-7 place-items-center rounded-full bg-foreground/10 transition-transform",
                                {
                                    dark: "bg-foreground/15",
                                    "group-hover/collapsibile-trigger":
                                        "bg-foreground/20 dark:bg-foreground/25",
                                    "group-active/collapsibile-trigger":
                                        "motion-preferred:translate-y-0.5",
                                    "group-not-data-expanded/collapsible":
                                        "bg-foreground/40 text-inverted dark:bg-foreground/60"
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
                                    "group-not-data-expanded/collapsible":
                                        "translate-x-[1px] translate-y-0 -rotate-90 dark:stroke-2.5"
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
                                variant="project"
                                item={item}
                                query={debouncedQuery}
                                onPress={onItemPress}
                                onSameLinkClick={onSameLinkClick}
                                onLinkClick={onLinkClick}
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
