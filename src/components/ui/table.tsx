"use client"

import {
    Cell as CellPrimitive,
    type CellProps,
    Column as ColumnPrimitive,
    type ColumnProps,
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
} from "react-aria-components/Table"

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

function TableRow<T>({ className, ...props }: RowProps<T>) {
    return (
        <RowPrimitive
            data-slot="table-row"
            className={cn(
                "data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50",
                className
            )}
            {...props}
        />
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

function TableCell({ className, ...props }: CellProps) {
    return (
        <CellPrimitive
            data-slot="table-cell"
            className={cn(
                "text-pretty p-2 align-middle has-[[role=checkbox]]:pr-0",
                {
                    md: "text-sm"
                },
                className
            )}
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
