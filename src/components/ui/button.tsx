"use client"

import { type VariantProps } from "class-variance-authority"
import {
    Button as ButtonPrimitive,
    type ButtonProps as ButtonPrimitiveProps
} from "react-aria-components/Button"
import {
    Link as LinkPrimitive,
    type LinkProps as LinkPrimitiveProps
} from "react-aria-components/Link"
import { useWebHaptics } from "web-haptics/react"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: Omit<ButtonPrimitiveProps, "className"> &
    React.RefAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        className?: string
    }) {
    const { trigger } = useWebHaptics()

    return (
        <ButtonPrimitive
            data-slot="button"
            data-variant={variant}
            data-size={size}
            data-cursor="target"
            onClick={() => void trigger("success")}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

function LinkButton({
    className,
    variant = "default",
    size = "default",
    nativeLink = false,
    ...props
}: Omit<LinkPrimitiveProps, "className"> &
    VariantProps<typeof buttonVariants> & {
        className?: string
        nativeLink?: boolean
    }) {
    const { trigger } = useWebHaptics()

    return (
        <LinkPrimitive
            {...(!nativeLink && {
                "data-slot": "link-button",
                "data-variant": variant,
                "data-size": size
            })}
            onClick={() => void trigger("success")}
            className={cn(
                nativeLink
                    ? className
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
        />
    )
}

export { Button, buttonVariants, LinkButton }
