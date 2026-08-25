"use client"

import { MoreHorizontalIcon } from "lucide-react"

import { Link, type LinkProps } from "@/components/ui/link"
import { cn } from "@/lib/utils"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            aria-label="pagination"
            data-slot="pagination"
            className={cn(className)}
            {...props}
        />
    )
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn(className)}
            {...props}
        />
    )
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="pagination-item"
            className={cn("h-full min-w-0", className)}
            {...props}
        />
    )
}

type PaginationLinkProps = {
    isActive?: boolean
} & LinkProps

function PaginationLink({
    className,
    isActive,
    ...props
}: PaginationLinkProps) {
    return (
        <Link
            data-slot="pagination-link"
            data-cursor="target"
            aria-current={isActive ? "page" : undefined}
            data-active={isActive}
            className={cn(className)}
            {...props}
        />
    )
}

function PaginationPrevious({
    className,
    label = "Go to previous page",
    ...props
}: React.ComponentProps<typeof PaginationLink> & {
    label?: string
}) {
    return (
        <PaginationLink
            aria-label={label}
            className={cn("h-full", className)}
            {...props}
        />
    )
}

function PaginationNext({
    className,
    label = "Go to next page",
    ...props
}: React.ComponentProps<typeof PaginationLink> & {
    label?: string
}) {
    return (
        <PaginationLink
            aria-label={label}
            className={cn("h-full", className)}
            {...props}
        />
    )
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn(
                "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        >
            <MoreHorizontalIcon />
            <span className="sr-only">More pages</span>
        </span>
    )
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
}
