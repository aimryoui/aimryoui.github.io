"use client"

import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function InputGroup({
    className,
    as,
    ...props
}: React.ComponentProps<"div"> & {
    as?: React.ElementType
}) {
    const Comp = as ?? "div"
    return (
        <Comp
            data-slot="input-group"
            role="group"
            className={cn(
                "group/input-group relative flex h-9 w-full min-w-0 items-center rounded-xl border border-input outline-transparent will-change-[outline,border] outline-40 transition-none has-[>textarea]:h-auto",
                {
                    dark: "bg-input/30 hover:bg-element-hover",
                    hover: "bg-element-hover",

                    // Variants based on alignment.
                    "[&>input]:has-[>[data-align=inline-start]]": "pl-2",
                    "[&>input]:has-[>[data-align=inline-end]]": "pr-2",
                    "has-[>[data-align=block-start]]": "h-auto flex-col pb-3",
                    "has-[>[data-align=block-end]]": "h-auto flex-col pt-3",

                    // Focus state.
                    "has-[[data-slot=input-group-control]:focus-visible]":
                        "border-ring outline-highlighted/30 outline-4 transition-[outline-color,outline-width] ease-out duration-250 hover:bg-transparent",

                    // Error state.
                    "has-[[data-slot][aria-invalid=true]]":
                        "border-destructive ring-destructive/20"
                },

                // Focus state.
                "dark:has-[[data-slot=input-group-control]:focus-visible]:hover:bg-input/30",

                // Error state.
                "dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

                className
            )}
            {...props}
        />
    )
}

const inputGroupAddonVariants = cva(
    "flex h-auto cursor-text select-none items-center justify-center gap-2 text-sm font-medium text-muted-foreground group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4",
    {
        variants: {
            align: {
                "inline-start":
                    "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.3rem]",
                "inline-end": "order-last has-[>kbd]:mr-2",
                "block-start":
                    "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [&.border-b]:pb-3",
                "block-end":
                    "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [&.border-t]:pt-3"
            }
        },
        defaultVariants: {
            align: "inline-start"
        }
    }
)

function InputGroupAddon({
    className,
    align = "inline-start",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({ align }), className)}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) {
                    return
                }
                e.currentTarget.parentElement?.querySelector("input")?.focus()
            }}
            {...props}
        />
    )
}

const inputGroupButtonVariants = cva(
    "flex items-center gap-2 text-sm shadow-none",
    {
        variants: {
            size: {
                xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
                sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
                "icon-xs":
                    "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
                "icon-sm": "size-8 p-0 has-[>svg]:p-0"
            }
        },
        defaultVariants: {
            size: "xs"
        }
    }
)

function InputGroupButton({
    className,
    type = "button",
    variant = "ghost",
    size = "xs",
    ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
    VariantProps<typeof inputGroupButtonVariants>) {
    return (
        <Button
            type={type}
            data-size={size}
            variant={variant}
            className={cn(inputGroupButtonVariants({ size }), className)}
            {...props}
        />
    )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
                className
            )}
            {...props}
        />
    )
}

function InputGroupInput({
    className,
    ...props
}: React.ComponentProps<"input">) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn(
                "flex-1 rounded-none border-0 bg-transparent shadow-none",
                "focus-visible:outline-none dark:!bg-transparent",
                className
            )}
            {...props}
        />
    )
}

function InputGroupTextarea({
    className,
    ...props
}: React.ComponentProps<"textarea">) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn(
                "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none",
                "focus-visible:ring-0 dark:bg-transparent",
                className
            )}
            {...props}
        />
    )
}

export {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea
}
