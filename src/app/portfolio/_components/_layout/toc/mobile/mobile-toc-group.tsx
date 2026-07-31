"use client"

import { memo } from "react"

import { ChevronDown } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { MobileTocItemRow } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-item-row"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { useTocGroup } from "@/portfolio/_hooks/use-toc-tree"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

interface MobileTocGroupProps {
    header: TocItemProps
    items: TocItemProps[]
    mode: PortfolioMode
    debouncedQuery: string
    onItemPress: (item: TocItemProps) => void
    onSameLinkClick: () => void
}

const MobileTocGroup = memo(
    ({
        header,
        items,
        mode,
        debouncedQuery,
        onItemPress,
        onSameLinkClick
    }: MobileTocGroupProps) => {
        const { isExpanded, setIsExpanded } = useTocGroup(items)

        return (
            <Collapsible
                defaultExpanded
                isExpanded={isExpanded}
                onExpandedChange={setIsExpanded}
                className="group/collapsible flex flex-col"
            >
                <MobileTocItemRow
                    variant="category"
                    mode={mode}
                    item={header}
                    query={debouncedQuery}
                    onPress={onItemPress}
                    onSameLinkClick={onSameLinkClick}
                >
                    <CollapsibleTrigger
                        pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                        className={cn(
                            "group/collapsibile-trigger -me-6 -mt-4 px-6 pb-2 pt-6",
                            "group-has-[input:not(:placeholder-shown)]/sidebar:hidden"
                        )}
                    >
                        <div
                            className={cn(
                                "grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform",
                                {
                                    dark: "bg-foreground/15",
                                    "group-hover/collapsibile-trigger":
                                        "bg-foreground/20 dark:bg-foreground/25",
                                    "group-active/collapsibile-trigger":
                                        "translate-y-0.5",
                                    "group-not-data-expanded/collapsible":
                                        "bg-foreground/40 text-inverted dark:bg-foreground/60"
                                }
                            )}
                        >
                            <ChevronDown
                                className={cn(
                                    "size-6 translate-y-[.5px] transition-transform duration-350",
                                    {
                                        "group-not-data-expanded/collapsible":
                                            "translate-x-[.5px] -rotate-90 dark:stroke-2.5"
                                    }
                                )}
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
MobileTocGroup.displayName = "MobileTocGroup"

export type { MobileTocGroupProps }
export { MobileTocGroup }
