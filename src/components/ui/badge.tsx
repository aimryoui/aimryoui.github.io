import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    cn(
        "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border border-transparent px-1 py-0.25 text-xs font-wght-500",
        {
            "aria-invalid":
                "border-destructive ring-destructive/20 dark:ring-destructive/40",
            "focus-visible": "border-ring ring-3 ring-ring/50",
            "has-data-[icon=inline-start]": "ps-1.5",
            "has-data-[icon=inline-end]": "pe-1.5",
            "[&>svg]": "pointer-events-none !size-3"
        }
    ),
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground is-[a]:hover:bg-primary/80",
                secondary:
                    "bg-secondary text-secondary-foreground is-[a]:hover:bg-secondary/80",
                destructive:
                    "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 is-[a]:hover:bg-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
                outline:
                    "border-border text-foreground is-[a]:hover:bg-muted is-[a]:hover:text-muted-foreground",
                "outline-tinted":
                    "border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground",
                ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
                link: "text-primary underline-offset-4 hover:underline"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

function Badge({
    className,
    variant = "default",
    render,
    ...props
}: React.ComponentProps<"span">
    & VariantProps<typeof badgeVariants> & {
        render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
    }) {
    if (render) {
        const renderProps = {
            "data-slot": "badge",
            "data-variant": variant,
            className: cn(badgeVariants({ variant }), className),
            ...props
        }

        return render(renderProps)
    }

    return (
        <span
            data-slot="badge"
            data-variant={variant}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
