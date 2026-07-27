"use client"

import { createContext, use, useMemo } from "react"
import NextLink from "next/link"

import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { composeRenderProps } from "react-aria-components"
import {
    Breadcrumb as BreadcrumbPrimitive,
    type BreadcrumbProps,
    Breadcrumbs as BreadcrumbsPrimitive,
    type BreadcrumbsProps,
    Link as LinkPrimitive,
    type LinkProps
} from "react-aria-components/Breadcrumbs"

import { cn } from "@/lib/utils"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            aria-label="breadcrumb"
            data-slot="breadcrumb"
            className={cn(
                "z-50 flex h-full items-center justify-start font-wght-500",
                className
            )}
            {...props}
        />
    )
}

function BreadcrumbList<T extends object>({
    className,
    ref,
    ...props
}: BreadcrumbsProps<T> & {
    ref: React.RefObject<HTMLOListElement | null>
}) {
    return (
        <BreadcrumbsPrimitive
            data-slot="breadcrumb-list"
            ref={ref}
            className={cn(
                "flex h-full items-center scroll-smooth text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}

const BreadcrumbItemContext = createContext<{ isCurrent: boolean }>({
    isCurrent: false
})

function BreadcrumbItemContextProvider({
    isCurrent,
    children
}: {
    isCurrent: boolean
    children: React.ReactNode
}) {
    const value = useMemo(() => ({ isCurrent }), [isCurrent])
    return (
        <BreadcrumbItemContext value={value}>{children}</BreadcrumbItemContext>
    )
}

function BreadcrumbItem({ className, children, ...props }: BreadcrumbProps) {
    return (
        <BreadcrumbPrimitive
            data-slot="breadcrumb-item"
            data-cursor="target"
            className={cn(
                "group inline-flex h-full items-center text-nowrap",
                className
            )}
            {...props}
        >
            {composeRenderProps(children, (children, { isCurrent }) => (
                <BreadcrumbItemContextProvider isCurrent={isCurrent}>
                    {children}
                </BreadcrumbItemContextProvider>
            ))}
        </BreadcrumbPrimitive>
    )
}

function BreadcrumbLink({
    className,
    spanClassName,
    ...props
}: LinkProps & {
    spanClassName?: string
}) {
    const { isCurrent } = use(BreadcrumbItemContext)
    return (
        <LinkPrimitive
            data-slot="breadcrumb-link"
            className={cn(
                "flex h-full items-center gap-1 text-muted-foreground/90 transition-[color] duration-100",
                "group-first:-ms-1.25 group-[:not(*:first-child)]:ps-1",
                {
                    hover: "text-foreground transition-none",
                    md: "py-3.5"
                },
                className
            )}
            render={(props) =>
                "href" in props ? (
                    <NextLink {...props} draggable={false}>
                        <span
                            data-cursor="lock"
                            className={cn("px-1.25 md:py-0.5", spanClassName)}
                        >
                            {props.children}
                        </span>
                        {!isCurrent && (
                            <span
                                data-slot="breadcrumb-separator"
                                role="presentation"
                                aria-hidden={true}
                                className={cn("text-muted-foreground/60", {
                                    "[&>svg]": "size-3.5"
                                })}
                            >
                                <ChevronRightIcon className="cn-rtl-flip" />
                            </span>
                        )}
                    </NextLink>
                ) : (
                    <span {...props} />
                )
            }
            {...props}
        />
    )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <button
            role="link"
            type="button"
            data-slot="breadcrumb-page"
            aria-current="page"
            onClick={() =>
                void window.dispatchEvent(
                    new CustomEvent("portfolio:main-flash")
                )
            }
            className={cn(
                "-me-1.25 grid h-full cursor-pointer place-items-center ps-1 text-foreground",
                {
                    md: "py-4"
                },
                className
            )}
        >
            <span data-cursor="lock" className="px-1.25" {...props} />
        </button>
    )
}

function BreadcrumbEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            aria-hidden={true}
            className={cn(
                "flex size-5 items-center justify-center [&>svg]:size-4",
                className
            )}
            {...props}
        >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
        </span>
    )
}

export {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage
}
