"use client"

import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

interface TextProps {
    highlight?: boolean
    italic?: boolean
    mono?: boolean
    asChild?: boolean
}

function H1({
    className,
    highlight,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"h1"> & TextProps) {
    const Comp = asChild ? Slot : "h1"
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

function H2({
    className,
    highlight,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"h2"> & TextProps) {
    const Comp = asChild ? Slot : "h2"
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

function H3({
    className,
    highlight,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"h3"> & TextProps) {
    const Comp = asChild ? Slot : "h3"
    return (
        <Comp
            className={cn(
                "text-pretty text-4xl",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono ? "font-mono" : "font-wght-[625]",
                className
            )}
            {...props}
        />
    )
}

function H4({
    className,
    highlight,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"h4"> & TextProps) {
    const Comp = asChild ? Slot : "h4"
    return (
        <Comp
            className={cn(
                "text-pretty",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
                className
            )}
            {...props}
        />
    )
}

function Bold({
    className,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"b"> & Omit<TextProps, "highlight">) {
    const Comp = asChild ? Slot : "b"
    return (
        <Comp
            className={cn(
                "text-foreground",
                italic && "italic",
                mono ? "font-mono" : "font-wght-600",
                className
            )}
            {...props}
        />
    )
}

function Highlight({
    className,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"b"> & Omit<TextProps, "highlight">) {
    const Comp = asChild ? Slot : "b"
    return (
        <Comp
            className={cn(
                "text-pretty text-highlighted",
                italic && "italic",
                mono ? "font-mono" : "font-wght-600",
                className
            )}
            {...props}
        />
    )
}

function Link({
    className,
    openInNewTab,
    highlight,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"a"> &
    TextProps & {
        openInNewTab?: boolean
    }) {
    const Comp = asChild ? Slot : "a"
    return (
        <Comp
            className={cn(
                "w-fit cursor-pointer text-pretty text-foreground underline",
                {
                    hover: "decoration-current decoration-solid",
                    "focus-visible": "text-highlighted"
                },
                highlight && "text-highlighted",
                italic && "italic",
                mono ? "font-mono" : "font-wght-600",
                className
            )}
            {...(openInNewTab && { target: "_blank", rel: "noreferrer" })}
            {...props}
        />
    )
}

function Text({
    className,
    italic,
    mono,
    asChild,
    ...props
}: React.ComponentProps<"p"> & Omit<TextProps, "highlight">) {
    const Comp = asChild ? Slot : "p"
    return (
        <Comp
            className={cn(
                "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
                className
            )}
            {...props}
        />
    )
}

function At({
    className,
    highlight,
    italic,
    mono
}: React.ComponentProps<"span"> & TextProps) {
    return (
        <>
            <span
                aria-hidden={true}
                role="presentation"
                className={cn(
                    "inline-block text-muted-foreground font-wght-400",
                    highlight && "text-highlighted",
                    italic && "italic",
                    mono && "font-mono",
                    className
                )}
            >
                @
            </span>
            <span className="sr-only">at</span>
        </>
    )
}

export { At, Bold, H1, H2, H3, H4, Highlight, Link, Text }
