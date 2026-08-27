"use client"

import { createContext, use, useMemo } from "react"

import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react"
import { composeRenderProps } from "react-aria-components"
import {
    Breadcrumb as BreadcrumbPrimitive,
    type BreadcrumbProps,
    Breadcrumbs as BreadcrumbsPrimitive,
    type BreadcrumbsProps
} from "react-aria-components/Breadcrumbs"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Link, type LinkProps } from "@/components/ui/link"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { cn } from "@/lib/utils"
import { useFlashStore } from "@/portfolio/_components/flash-overlay"

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
                "flex h-full items-center text-muted-foreground motion-preferred:scroll-smooth",
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
                "group/breadcrumb-item inline-flex h-full items-center text-nowrap",
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

function BreadcrumbSeparator({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden={true}
            className={cn("grid size-6 place-items-center", className)}
            {...props}
        >
            <div className="size-1.5 rounded-full bg-muted-foreground/50" />
        </span>
    )
}

function BreadcrumbLink({
    className,
    spanClassName,
    onPress,
    ...props
}: LinkProps & {
    spanClassName?: string
}) {
    const { isCurrent } = use(BreadcrumbItemContext)

    const playPressFeedback = usePressFeedback()

    return (
        <Link
            data-slot="breadcrumb-link"
            data-sound="button"
            className={cn(
                "flex h-full items-center text-muted-foreground/90 transition-[color] duration-100",
                "group-first/breadcrumb-item:-ms-1.25",
                {
                    hover: "text-foreground transition-none",
                    "data-[popup-open]": "text-foreground",
                    lg: "text-sm",
                    md: "py-2"
                },
                className
            )}
            onPress={(e) => {
                playPressFeedback("button")

                onPress?.(e)
            }}
            {...props}
        >
            <span
                data-cursor="lock"
                className={cn("px-1.25 py-0.5", spanClassName)}
            >
                {props.children}
            </span>
            {!isCurrent && <BreadcrumbSeparator />}
        </Link>
    )
}

function BreadcrumbPage({
    className,
    spanClassName,
    children,
    ...props
}: Omit<ButtonProps, "children">
    & Pick<React.ComponentProps<"span">, "children"> & {
        spanClassName?: string
    }) {
    const { isCurrent } = use(BreadcrumbItemContext)

    return (
        <Button
            data-slot="breadcrumb-page"
            aria-current="page"
            nativeButton
            keepFeedback
            onPress={() => {
                useFlashStore.getState().triggerFlash()
            }}
            className={cn(
                "-me-1.25 flex h-full items-center text-foreground",
                {
                    active: "not-aria-[haspopup]:motion-preferred:translate-y-px",
                    lg: "text-sm",
                    md: "py-2"
                },
                className
            )}
            {...props}
        >
            <span
                data-cursor="lock"
                className={cn("px-1.25 py-0.5", spanClassName)}
            >
                {children}
            </span>
            {!isCurrent && <BreadcrumbSeparator />}
        </Button>
    )
}

function BreadcrumbMenu({
    className,
    spanClassName,
    anchorRef,
    children,
    ...props
}: Omit<ButtonProps, "children"> & {
    spanClassName?: string
    anchorRef?: React.Ref<HTMLSpanElement>
    children?: React.ReactNode
}) {
    const { isCurrent } = use(BreadcrumbItemContext)

    return (
        <Button
            data-slot="breadcrumb-menu"
            nativeButton
            keepFeedback
            className={cn(
                "group/breadcrumb-trigger flex h-full items-center text-muted-foreground/90 transition-[color] duration-100",
                "group-first/breadcrumb-item:-ms-1.25",
                {
                    hover: "text-foreground transition-none",
                    lg: "text-sm",
                    md: "py-2"
                },
                className
            )}
            {...props}
        >
            <span
                ref={anchorRef}
                data-cursor="lock"
                className={cn(
                    "flex items-center gap-1 py-0.5 pe-0.5 ps-1.25",
                    {
                        "group-data-[popup-open]/breadcrumb-trigger":
                            "text-foreground"
                    },
                    spanClassName
                )}
            >
                {children}
                <BreadcrumbChevron />
            </span>
            {!isCurrent && <BreadcrumbSeparator />}
        </Button>
    )
}

function BreadcrumbMenuPage({
    className,
    spanClassName,
    anchorRef,
    children,
    ...props
}: Omit<ButtonProps, "children"> & {
    spanClassName?: string
    anchorRef?: React.Ref<HTMLSpanElement>
    children?: React.ReactNode
}) {
    const { isCurrent } = use(BreadcrumbItemContext)

    return (
        <Button
            data-slot="breadcrumb-menu-page"
            aria-current="page"
            nativeButton
            keepFeedback
            className={cn(
                "group/breadcrumb-trigger -me-1.25 flex h-full items-center text-foreground",
                {
                    lg: "text-sm",
                    md: "py-2"
                },
                className
            )}
            {...props}
        >
            <span
                ref={anchorRef}
                data-cursor="lock"
                className={cn(
                    "flex items-center gap-1 py-0.5 pe-0.5 ps-1.25",
                    spanClassName
                )}
            >
                {children}
                <BreadcrumbChevron />
            </span>
            {!isCurrent && <BreadcrumbSeparator />}
        </Button>
    )
}

function BreadcrumbChevron({
    className,
    ...props
}: React.ComponentProps<"svg">) {
    return (
        <ChevronDownIcon
            className={cn(
                "size-4 text-muted-foreground",
                {
                    "motion-preferred": "transition-transform duration-400",
                    "group-hover/breadcrumb-item": "text-foreground",
                    "group-hover/breadcrumb-trigger": "text-foreground",
                    "group-data-[popup-open]/breadcrumb-trigger":
                        "-rotate-180 text-foreground"
                },
                className
            )}
            {...props}
        />
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
            className={cn("flex size-5 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontalIcon className="size-4" />
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
    BreadcrumbMenu,
    BreadcrumbMenuPage,
    BreadcrumbPage
}
