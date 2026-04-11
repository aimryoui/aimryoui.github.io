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
                "text-4xl font-extrabold",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
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
                "text-4xl font-extrabold",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
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
                "text-4xl font-extrabold",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
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
                mono && "font-mono",
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
                "text-highlighted",
                italic && "italic",
                mono && "font-mono",
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
                "w-fit cursor-pointer font-bold text-foreground underline",
                {
                    hover: "decoration-current decoration-solid",
                    "focus-visible": "text-highlighted"
                },
                highlight && "text-highlighted",
                italic && "italic",
                mono && "font-mono",
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
        <span
            className={cn(
                "inline-block -translate-y-[0.125em] font-normal text-muted-foreground",
                highlight && "text-highlighted",
                italic && "italic",
                mono && "font-mono",
                className
            )}
        >
            @
        </span>
    )
}

export { At, Bold, H1, H2, H3, H4, Highlight, Link, Text }
