"use client"

import { memo } from "react"

import { ChevronDown } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import {
    type TocItemProps,
    TocItemRow
} from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocGroup } from "@/portfolio/_hooks/use-toc-tree"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface TocGroupProps {
    header: TocItemProps
    items: TocItemProps[]
    mode: PortfolioMode
    debouncedQuery: string
    onItemPress: (item: TocItemProps) => void
    onSameLinkClick: () => void
}

const TocGroup = memo(
    ({
        header,
        items,
        mode,
        debouncedQuery,
        onItemPress,
        onSameLinkClick
    }: TocGroupProps) => {
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
                className={cn(
                    "group/collapsible flex flex-col",
                    isExpanded && "-mb-3",
                    {
                        "motion-safe":
                            "transition-[margin] ease-spring duration-350"
                    }
                )}
            >
                <TocItemRow
                    variant="category"
                    mode={mode}
                    item={header}
                    query={debouncedQuery}
                    onPress={onItemPress}
                    onSameLinkClick={onSameLinkClick}
                >
                    <TooltipTrigger
                        delay={500}
                        payload={{
                            content: (
                                <span>
                                    {isExpanded ? "Collapse" : "Expand"}{" "}
                                    <Highlight>{header.label}</Highlight>{" "}
                                    category
                                </span>
                            ),
                            side: "right",
                            sideOffset: -14,
                            alignOffset: 6
                        }}
                        render={
                            <CollapsibleTrigger
                                pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                                className={cn(
                                    "group/collapsibile-trigger -mt-3 pb-1 pe-5.5 ps-5 pt-4",
                                    "group-has-[input:not(:placeholder-shown)]/sidebar:hidden",
                                    {
                                        "group-not-data-expanded/collapsible":
                                            "-mb-3 pb-4"
                                    }
                                )}
                            >
                                <div
                                    data-cursor="lock"
                                    className={cn(
                                        "grid size-6 place-items-center rounded-[.75rem] bg-foreground/10 !corner-round transition-[border-radius,transform,translate] duration-100",
                                        {
                                            dark: "bg-foreground/15",
                                            "group-hover/collapsibile-trigger":
                                                "rounded-none bg-foreground/20 dark:bg-foreground/25",
                                            "group-active/collapsibile-trigger":
                                                "translate-y-0.5",
                                            "group-not-data-expanded/collapsible":
                                                "bg-foreground/40 text-inverted dark:bg-foreground/60"
                                        }
                                    )}
                                >
                                    <ChevronDown
                                        className={cn(
                                            "size-5 translate-y-[.5px] transition-transform duration-350",
                                            {
                                                "group-not-data-expanded/collapsible":
                                                    "translate-x-[.5px] translate-y-0 -rotate-90 dark:stroke-2.5"
                                            }
                                        )}
                                    />
                                </div>
                            </CollapsibleTrigger>
                        }
                    />
                </TocItemRow>
                <CollapsibleContent>
                    <ul className="flex flex-col pb-3">
                        {items.map((item) => (
                            <TocItemRow
                                key={item.id}
                                variant="project"
                                mode={mode}
                                item={item}
                                query={debouncedQuery}
                                onPress={onItemPress}
                                onSameLinkClick={onSameLinkClick}
                            />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        )
    }
)
TocGroup.displayName = "TocGroup"

export type { TocGroupProps }
export { TocGroup }
