"use client"

import { ChevronDown } from "lucide-react"
import {
    Cell as CellPrimitive,
    type CellProps,
    Collection as CollectionPrimitive,
    Column as ColumnPrimitive,
    type ColumnProps,
    composeRenderProps,
    Row as RowPrimitive,
    type RowProps,
    TableBody as TableBodyPrimitive,
    type TableBodyProps,
    TableFooter as TableFooterPrimitive,
    type TableFooterProps,
    TableHeader as TableHeaderPrimitive,
    type TableHeaderProps,
    Table as TablePrimitive,
    type TableProps
} from "react-aria-components"

import { Button, type TrackingData } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function TableContainer({
    className,
    ...props
}: React.ComponentProps<"figure">) {
    return (
        <figure
            data-slot="table-container"
            className={cn("relative w-full", className)}
            {...props}
        />
    )
}

function TableCaption({
    className,
    ...props
}: React.ComponentProps<"figcaption">) {
    return (
        <figcaption
            data-slot="table-caption"
            className={cn(
                "text-left text-highlighted",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

function Table({ className, ...props }: TableProps) {
    return (
        <TablePrimitive
            data-slot="table"
            className={cn("w-full caption-top", className)}
            {...props}
        />
    )
}

function TableHeader<T>({ className, ...props }: TableHeaderProps<T>) {
    return (
        <TableHeaderPrimitive
            data-slot="table-header"
            className={cn("", className)}
            {...props}
        />
    )
}

function TableBody<T>({ className, ...props }: TableBodyProps<T>) {
    return (
        <TableBodyPrimitive
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    )
}

function TableFooter<T>({ className, ...props }: TableFooterProps<T>) {
    return (
        <TableFooterPrimitive
            data-slot="table-footer"
            className={cn("[&>tr]:last:border-b-0", className)}
            {...props}
        />
    )
}

function TableRow<T>({ className, columns, children, ...props }: RowProps<T>) {
    return (
        <RowPrimitive
            data-slot="table-row"
            className={cn(
                "group/table-row data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50",
                className
            )}
            {...props}
        >
            <CollectionPrimitive items={columns}>
                {children}
            </CollectionPrimitive>
        </RowPrimitive>
    )
}

function TableHead({ className, ...props }: ColumnProps) {
    return (
        <ColumnPrimitive
            data-slot="table-head"
            className={cn(
                "whitespace-nowrap px-2 text-left align-middle has-[[role=checkbox]]:pr-0",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

function TableCell({
    className,
    spanClassName,
    tracking,
    ...props
}: CellProps & {
    spanClassName?: string
    tracking?: TrackingData
}) {
    return (
        <CellPrimitive
            data-slot="table-cell"
            className={cn(
                "group/table-cell text-pretty align-middle text-base has-[[role=checkbox]]:pr-0",
                {
                    md: "text-sm"
                },
                className
            )}
            // style={({ hasChildItems, isTreeColumn, level }) => ({
            //     paddingInlineStart: isTreeColumn
            //         ? 4 + (hasChildItems ? 0 : 20) + (level - 1) * 16
            //         : undefined
            // })}
            {...props}
        >
            {composeRenderProps(
                props.children,
                (
                    children,
                    { hasChildItems, isTreeColumn, isExpanded, isDisabled }
                ) => (
                    <>
                        {children}
                        {hasChildItems && isTreeColumn && (
                            <Button
                                slot="chevron"
                                nativeButton
                                keepFeedback
                                tracking={
                                    tracking
                                        ? {
                                              eventName: tracking.eventName,
                                              eventParams: {
                                                  ...tracking.eventParams,
                                                  action: isExpanded
                                                      ? "collapse"
                                                      : "expand"
                                              }
                                          }
                                        : undefined
                                }
                                className={cn(
                                    "absolute inset-0 z-2 flex items-start text-muted-foreground/80 transition-[color] duration-100 dark:text-muted-foreground/50",
                                    "-my-[calc(var(--spacing-table-between)/2)] py-[calc(var(--spacing-table-between)/2)]",
                                    isDisabled
                                        ? "pointer-events-none"
                                        : {
                                              "group-not-[:has(a:hover)]/table-row":
                                                  {
                                                      "group-hover/table-cell":
                                                          "text-muted-foreground transition-none",
                                                      "group-active/table-cell":
                                                          "text-foreground transition-none",
                                                      "group-data-expanded/table-cell":
                                                          "text-foreground transition-none"
                                                  },

                                              "group-first/table-row":
                                                  "-mb-[calc(var(--spacing-table-between)/2)] -mt-safe-zone-vertical pb-[calc(var(--spacing-table-between)/2)] pt-safe-zone-vertical",
                                              "group-only/table-row":
                                                  "-my-safe-zone-vertical py-safe-zone-vertical",
                                              "group-last/table-row":
                                                  "-mb-safe-zone-vertical -mt-[calc(var(--spacing-table-between)/2)] pb-safe-zone-vertical pt-[calc(var(--spacing-table-between)/2)]"
                                          },
                                    {
                                        "@[69rem]": "pe-safe-zone",
                                        sm: [
                                            "-my-[calc(var(--spacing-table-between)/2+var(--spacing)*.75/2)]",
                                            {
                                                "group-first/table-row":
                                                    "-mb-[calc(var(--spacing-table-between)/2+var(--spacing)*.75/2)] -mt-safe-zone-vertical pb-[calc(var(--spacing-table-between)/2+var(--spacing)*.75/2)] pt-safe-zone-vertical",
                                                "group-last/table-row":
                                                    "-mb-safe-zone-vertical -mt-[calc(var(--spacing-table-between)/2+var(--spacing)*.75/2)] pb-safe-zone-vertical pt-[calc(var(--spacing-table-between)/2+var(--spacing)*.75/2)]"
                                            }
                                        ]
                                    }
                                )}
                            >
                                <span
                                    data-cursor="lock"
                                    className={cn(
                                        "-ms-1.5 -mt-0.5 inline-flex min-w-[calc(100%-var(--spacing)*2)] items-center justify-end py-0.5 text-sm",
                                        spanClassName
                                    )}
                                >
                                    <span className="@[69rem]:hidden">
                                        Details
                                    </span>
                                    <ChevronDown
                                        aria-hidden
                                        strokeWidth={1.5}
                                        className={cn(
                                            "size-5 -translate-y-[.5px]",
                                            {
                                                "motion-preferred":
                                                    "transition-transform duration-300 group-data-expanded/table-cell:-rotate-180"
                                            }
                                        )}
                                    />
                                </span>
                            </Button>
                        )}
                    </>
                )
            )}
        </CellPrimitive>
    )
}

export {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
}
