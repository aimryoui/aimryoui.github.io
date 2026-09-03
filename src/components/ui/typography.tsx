"use client"

import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

type TextProps<T extends React.ElementType> = {
    as?: T
    className?: string
    highlight?: boolean
    italic?: boolean
    mono?: boolean
} & Omit<
    React.ComponentPropsWithRef<T>,
    "as" | "className" | "highlight" | "italic" | "mono"
>

function H1<T extends React.ElementType = "h1">({
    className,
    highlight,
    italic,
    mono,
    as,
    ...props
}: TextProps<T>) {
    const Comp = as ?? "h1"

    return (
        <Comp
            className={cn(
                "text-pretty text-4xl",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono ? "font-mono" : "font-wght-[625]",
                {
                    md: "text-3xl"
                },
                className
            )}
            {...props}
        />
    )
}

function H2<T extends React.ElementType = "h2">({
    className,
    highlight,
    italic,
    mono,
    as,
    ...props
}: TextProps<T>) {
    const Comp = as ?? "h2"

    return (
        <Comp
            className={cn(
                "text-pretty text-4xl",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono ? "font-mono" : "font-wght-[625]",
                {
                    md: "text-3xl"
                },
                className
            )}
            {...props}
        />
    )
}

function H3<T extends React.ElementType = "h3">({
    className,
    highlight,
    italic,
    mono,
    as,
    ...props
}: TextProps<T>) {
    const Comp = as ?? "h3"

    return (
        <Comp
            className={cn(
                "text-pretty text-4xl",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono ? "font-mono" : "font-wght-[625]",
                {
                    md: "text-3xl"
                },
                className
            )}
            {...props}
        />
    )
}

function H4<T extends React.ElementType = "h4">({
    className,
    highlight,
    italic,
    mono,
    as,
    ...props
}: TextProps<T>) {
    const Comp = as ?? "h4"

    return (
        <Comp
            className={cn(
                "text-pretty",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

type BoldProps<T extends React.ElementType> = {
    as?: T
    className?: string
    italic?: boolean
    mono?: boolean
} & Omit<
    React.ComponentPropsWithRef<T>,
    "as" | "className" | "highlight" | "italic" | "mono"
>

function Bold<T extends React.ElementType = "b">({
    className,
    italic,
    mono,
    as,
    ...props
}: BoldProps<T>) {
    const Comp = as ?? "b"

    return (
        <Comp
            className={cn(
                "text-foreground",
                italic && "italic",
                mono ? "font-mono" : "font-wght-600",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

function Highlight<T extends React.ElementType = "b">({
    className,
    italic,
    mono,
    as,
    ...props
}: BoldProps<T>) {
    const Comp = as ?? "b"

    return (
        <Comp
            className={cn(
                "text-pretty text-highlighted",
                italic && "italic",
                mono ? "font-mono" : "font-wght-600",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

type LinkProps<T extends React.ElementType> = TextProps<T> & {
    openInNewTab?: boolean
    showExternalIcon?: boolean
}

function Link<T extends React.ElementType = "a">({
    className,
    openInNewTab,
    showExternalIcon,
    highlight,
    italic,
    mono,
    as,
    children,
    ...props
}: LinkProps<T>) {
    const Comp = as ?? "a"

    return (
        <Comp
            className={cn(
                "w-fit cursor-pointer text-pretty text-foreground underline",
                {
                    hover: "decoration-current decoration-solid",
                    active: "decoration-current decoration-solid",
                    "focus-visible": "text-highlighted"
                },
                highlight && "text-highlighted",
                italic && "italic",
                mono ? "font-mono" : "font-wght-600",
                className
            )}
            {...(openInNewTab && { target: "_blank", rel: "noreferrer" })}
            {...props}
        >
            {children}
            {showExternalIcon && (
                <ArrowUpRight className="mb-1.5 inline size-4" />
            )}
        </Comp>
    )
}

function Text<T extends React.ElementType = "p">({
    className,
    italic,
    mono,
    as,
    ...props
}: BoldProps<T>) {
    const Comp = as ?? "p"

    return (
        <Comp
            className={cn(
                "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        />
    )
}

function At<T extends React.ElementType = "span">({
    className,
    highlight,
    italic,
    mono,
    as,
    ...props
}: TextProps<T>) {
    const Comp = as ?? "span"
    return (
        <>
            <Comp
                aria-hidden={true}
                role="presentation"
                className={cn(
                    "inline-block text-muted-foreground font-wght-400",
                    highlight && "text-highlighted",
                    italic && "italic",
                    mono && "font-mono",
                    {
                        md: "text-sm"
                    },
                    className
                )}
                {...props}
            >
                @
            </Comp>
            <span className="sr-only">at</span>
        </>
    )
}

export { At, Bold, H1, H2, H3, H4, Highlight, Link, Text }
