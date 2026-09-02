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
import { useTocStore } from "@/portfolio/_components/_layout/toc/stores/toc-store"
import { TocItemRow } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import { useTocGroup } from "@/portfolio/_hooks/use-toc-tree"

interface TocGroupProps extends CollapsibleProps {
    header: TocItemProps
    items: TocItemProps[]
    onItemPress: (item: TocItemProps) => void
    collapsible?: boolean
    isFirst?: boolean
    isLast?: boolean
}

const TocGroup = memo(
    ({
        className,
        header,
        items,
        onItemPress,
        collapsible,
        isFirst,
        isLast,
        ...props
    }: TocGroupProps) => {
        const compact = useTocStore((s) => s.compact)
        const isSelectedWorks = header.id === "selected-works"
        const { isExpanded, setIsExpanded } = useTocGroup(
            items,
            isSelectedWorks
        )

        const hasActiveChild = useTocStore((s) =>
            s.activeId ? items.some((item) => item.id === s.activeId) : false
        )

        return items.length === 0 || collapsible === false ? (
            <>
                <TocItemRow
                    variant="header"
                    item={header}
                    onPress={onItemPress}
                    collapsible={false}
                    className={cn(className)}
                />
                {items.length > 0 && (
                    <ul className={cn("flex flex-col pb-3", className)}>
                        {items.map((item) => (
                            <TocItemRow
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
                defaultExpanded={isSelectedWorks}
                isExpanded={isExpanded}
                onExpandedChange={setIsExpanded}
                className={cn(
                    "flex flex-col",
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
                    variant="header"
                    item={header}
                    onPress={onItemPress}
                    activeViaChild={
                        (hasActiveChild && !isExpanded) || undefined
                    }
                >
                    <TooltipTrigger
                        delay={500}
                        payload={{
                            content: (
                                <span>
                                    {isExpanded ? "Collapse" : "Expand"}{" "}
                                    <Highlight>{header.label}</Highlight>{" "}
                                    {compact ? "section" : "category"}
                                </span>
                            ),
                            side: "inline-end",
                            sideOffset: -14,
                            alignOffset: compact
                                ? isFirst
                                    ? 6
                                    : !isExpanded && isLast
                                      ? -6
                                      : 0
                                : isExpanded
                                  ? 6
                                  : 0
                        }}
                        render={
                            <CollapsibleTrigger
                                pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                                className={cn(
                                    "pe-5.5 ps-5",
                                    "group-has-[input:not(:placeholder-shown)]/sidebar:hidden",
                                    compact
                                        ? [
                                              "py-1.5",
                                              {
                                                  "group-first/collapsible":
                                                      "-mt-3 pt-4.5",
                                                  "group-last/collapsible:group-not-data-expanded/collapsible":
                                                      "-mb-3 pb-4.5",
                                                  md: [
                                                      "py-2",
                                                      {
                                                          "group-first/collapsible":
                                                              "-mt-3 pt-4.5",
                                                          "group-last/collapsible:group-not-data-expanded/collapsible":
                                                              "-mb-3 pb-4.5"
                                                      }
                                                  ]
                                              }
                                          ]
                                        : [
                                              "-my-3 py-4.5",
                                              {
                                                  "group-data-expanded/collapsible":
                                                      "-mt-6 pb-1.5"
                                              }
                                          ],
                                    {
                                        lg: [
                                            "px-safe-zone py-4",
                                            {
                                                "group-data-expanded/collapsible":
                                                    "pb-1"
                                            }
                                        ]
                                    }
                                )}
                            >
                                <div
                                    data-cursor="lock"
                                    className={cn(
                                        "grid size-6 place-items-center rounded-[.75rem] !corner-round transition-[border-radius,transform,translate] duration-100",
                                        {
                                            "group-active/collapsible-trigger":
                                                "motion-preferred:translate-y-0.5"
                                        },
                                        compact
                                            ? [
                                                  "text-muted-foreground/70",
                                                  {
                                                      "group-hover/collapsible-trigger":
                                                          "bg-foreground/15 text-foreground data-target-cursor:rounded-none dark:bg-foreground/20",
                                                      "group-active/collapsible-trigger":
                                                          "bg-foreground/20 text-foreground data-target-cursor:rounded-none dark:bg-foreground/15",
                                                      "group-data-expanded/collapsible":
                                                          "text-foreground"
                                                  }
                                              ]
                                            : [
                                                  "bg-foreground/40 text-inverted",
                                                  {
                                                      dark: "bg-foreground/60",
                                                      "group-hover/collapsible-trigger":
                                                          "bg-foreground/35 data-target-cursor:rounded-none dark:bg-foreground/55",
                                                      "group-focus-visible/collapsible-trigger":
                                                          "bg-foreground/35 data-target-cursor:rounded-none dark:bg-foreground/55",
                                                      "group-data-expanded/collapsible":
                                                          [
                                                              "bg-foreground/10 text-muted-foreground",
                                                              {
                                                                  dark: "bg-foreground/15",
                                                                  "group-hover/collapsible-trigger":
                                                                      "bg-foreground/20 text-foreground data-target-cursor:rounded-none dark:bg-foreground/25",
                                                                  "group-focus-visible/collapsible-trigger":
                                                                      "bg-foreground/20 text-foreground dark:bg-foreground/25"
                                                              }
                                                          ]
                                                  }
                                              ],
                                        {
                                            rtl: "-scale-y-100",
                                            lg: "size-7 rounded-[.875rem]"
                                        }
                                    )}
                                >
                                    <ChevronDown
                                        className={cn(
                                            "size-5 translate-y-[.5px]",
                                            {
                                                "motion-preferred":
                                                    "transition-transform duration-350",
                                                rtl: "-translate-y-[.5px] rotate-180",
                                                "group-not-data-expanded/collapsible":
                                                    [
                                                        "translate-x-[.5px] translate-y-0 -rotate-90",
                                                        !compact
                                                            && "dark:stroke-2.5",
                                                        {
                                                            rtl: "-translate-x-[.5px] rotate-90"
                                                        }
                                                    ],
                                                lg: "size-6"
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
TocGroup.displayName = "TocGroup"

export type { TocGroupProps }
export { TocGroup }
