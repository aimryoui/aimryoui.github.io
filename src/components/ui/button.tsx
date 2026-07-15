import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    cn(
        "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm will-change-transform outline-none transition-transform",
        {
            active: "not-aria-[haspopup]:translate-y-px",
            "aria-invalid":
                "border-destructive ring-destructive/20 dark:ring-destructive/40",
            "focus-visible": "border-ring ring ring-ring/50",
            disabled: "pointer-events-none cursor-default opacity-40",
            "[&_svg:not([class*='size-'])]": "size-4",
            "[&_svg]": "pointer-events-none shrink-0"
        }
    ),
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
                outline:
                    "border border-stroke bg-background hover:bg-element-hover hover:text-foreground active:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground",
                ghost: "hover:bg-accent hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
                link: "text-primary underline-offset-4 hover:underline"
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
                "icon-xl": "size-12"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
