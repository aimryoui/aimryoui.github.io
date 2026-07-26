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
    onPress,
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
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
            onPress={(e) => {
                void trigger("success")
                onPress?.(e)
            }}
        />
    )
}

function LinkButton({
    className,
    variant = "default",
    size = "default",
    nativeLink = false,
    onPress,
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
            className={cn(
                nativeLink
                    ? className
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
            onPress={(e) => {
                void trigger("success")
                onPress?.(e)
            }}
        />
    )
}

export { Button, buttonVariants, LinkButton }
