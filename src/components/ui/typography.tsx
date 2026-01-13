import { cn } from "@/lib/utils"

function H1({
    className,
    style,
    children,
    highlight,
    italic,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    highlight?: boolean
    italic?: boolean
}) {
    return (
        <h1
            className={cn(
                "text-4xl font-extrabold",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </h1>
    )
}

function H2({
    className,
    style,
    children,
    highlight,
    italic,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    highlight?: boolean
    italic?: boolean
}) {
    return (
        <h2
            className={cn(
                "text-2xl",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </h2>
    )
}

function H3({
    className,
    style,
    children,
    highlight,
    italic,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    highlight?: boolean
    italic?: boolean
}) {
    return (
        <h3
            className={cn(
                "text-4xl font-extrabold",
                highlight ? "text-highlighted" : "text-muted-foreground",
                italic && "italic",
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </h3>
    )
}

function Bold({
    className,
    style,
    children,
    italic,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    italic?: boolean
}) {
    return (
        <b
            className={cn("text-foreground", italic && "italic", className)}
            style={style}
            {...props}
        >
            {children}
        </b>
    )
}

function Highlight({
    className,
    style,
    children,
    italic,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    italic?: boolean
}) {
    return (
        <b
            className={cn("text-highlighted", italic && "italic", className)}
            style={style}
            {...props}
        >
            {children}
        </b>
    )
}

function Link({
    className,
    style,
    children,
    url,
    openInNewTab,
    italic,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    url: string
    openInNewTab?: boolean
    italic?: boolean
}) {
    return (
        <a
            className={cn(
                "text-foreground w-fit font-bold hover:underline",
                italic && "italic",
                className
            )}
            href={url}
            {...(openInNewTab && { target: "_blank", rel: "noreferrer" })}
            style={style}
            {...props}
        >
            {children}
        </a>
    )
}

function Text({
    className,
    style,
    children,
    italic,
    mono,
    ...props
}: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    italic?: boolean
    mono?: boolean
}) {
    return (
        <p
            className={cn(
                "text-muted-foreground",
                italic && "italic",
                mono && "font-mono",
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </p>
    )
}

function At({
    className
}: {
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <span
            className={cn(
                "text-muted-foreground -mt-[0.125em] font-normal",
                className
            )}
        >
            @
        </span>
    )
}

export { At, Bold, H1, H2, H3, Highlight, Link, Text }
