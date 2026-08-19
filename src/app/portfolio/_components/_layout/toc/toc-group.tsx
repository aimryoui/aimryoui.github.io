"use client"

import { memo } from "react"

import { ChevronDown } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    type CollapsibleProps,
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

interface TocGroupProps extends CollapsibleProps {
    header: TocItemProps
    items: TocItemProps[]
    debouncedQuery: string
    onItemPress: (item: TocItemProps) => void
    onSameLinkClick: () => void
}

const TocGroup = memo(
    ({
        className,
        header,
        items,
        debouncedQuery,
        onItemPress,
        onSameLinkClick,
        ...props
    }: TocGroupProps) => {
        const isSelectedWorks = header.id === "selected-works"
        const { isExpanded, setIsExpanded } = useTocGroup(
            items,
            !isSelectedWorks
        )

        return (
            <Collapsible
                defaultExpanded={!isSelectedWorks}
                isExpanded={isExpanded}
                onExpandedChange={setIsExpanded}
                className={cn(
                    "group/collapsible flex flex-col",
                    isExpanded && "-mb-3",
                    {
                        "motion-preferred":
                            "transition-[margin] ease-spring duration-350"
                    },
                    className
                )}
                {...props}
            >
                <TocItemRow
                    variant="category"
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
                            side: "inline-end",
                            sideOffset: -14,
                            alignOffset: isSelectedWorks ? 0 : 6
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
                                                "bg-foreground/20 data-target-cursor:rounded-none dark:bg-foreground/25",
                                            "group-active/collapsibile-trigger":
                                                "motion-preferred:translate-y-0.5",
                                            "group-not-data-expanded/collapsible":
                                                [
                                                    "bg-foreground/40 text-inverted dark:bg-foreground/60",
                                                    {
                                                        "group-hover/collapsibile-trigger":
                                                            "bg-foreground/35 data-target-cursor:rounded-none dark:bg-foreground/55"
                                                    }
                                                ]
                                        }
                                    )}
                                >
                                    <ChevronDown
                                        className={cn(
                                            "size-5 translate-y-[.5px]",
                                            {
                                                "motion-preferred":
                                                    "transition-transform duration-350",
                                                "group-not-data-expanded/collapsible":
                                                    [
                                                        "translate-x-[.5px] translate-y-0 -rotate-90 dark:stroke-2.5",
                                                        {
                                                            rtl: "-translate-x-[.5px] -scale-y-100"
                                                        }
                                                    ]
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
