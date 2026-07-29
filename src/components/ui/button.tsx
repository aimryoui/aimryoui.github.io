"use client"

import NextLink from "next/link"

import { type VariantProps } from "class-variance-authority"
import {
    Button as ButtonPrimitive,
    type ButtonProps as ButtonPrimitiveProps
} from "react-aria-components/Button"
import {
    Link as LinkPrimitive,
    type LinkProps
} from "react-aria-components/Link"
import { type defaultPatterns } from "web-haptics"

import { buttonVariants } from "@/components/ui/button-variants"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { type HoverSoundType, type PressSoundType } from "@/lib/sounds"
import { cn } from "@/lib/utils"

type HapticVariantsType = keyof typeof defaultPatterns

interface ButtonFeedback {
    haptic?: HapticVariantsType
    hoverSound?: HoverSoundType
    pressSound?: PressSoundType
}

type ButtonProps = Omit<ButtonPrimitiveProps, "className"> &
    React.RefAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> &
    ButtonFeedback & {
        className?: string
        nativeButton?: boolean
        keepFeedback?: boolean
        mute?: boolean
    }

function Button({
    className,
    variant = "default",
    size = "default",
    nativeButton = false,
    keepFeedback = false,
    haptic = "light",
    hoverSound = "button",
    pressSound = "button",
    mute = false,
    onPress,
    ...props
}: ButtonProps) {
    const playPressFeedback = usePressFeedback()

    return (
        <ButtonPrimitive
            {...(nativeButton && {
                "data-slot": "button",
                "data-variant": variant,
                "data-size": size
            })}
            data-cursor="target"
            {...(!mute &&
                (!nativeButton || keepFeedback) && {
                    "data-sound": hoverSound,
                    onPress: (e) => {
                        playPressFeedback(pressSound, haptic)

                        onPress?.(e)
                    }
                })}
            className={cn(
                nativeButton
                    ? className
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
        />
    )
}

type NextLinkProps = React.ComponentProps<typeof NextLink>

type LinkButtonProps = Omit<NextLinkProps, "href"> &
    LinkProps &
    VariantProps<typeof buttonVariants> &
    ButtonFeedback & {
        nativeLink?: boolean
        keepFeedback?: boolean
        openInNewTab?: boolean
        mute?: boolean
    }

function LinkButton({
    className,
    variant = "default",
    size = "default",
    nativeLink = false,
    keepFeedback = false,
    openInNewTab = false,
    haptic = "medium",
    hoverSound = "button",
    pressSound = "button",
    mute = false,
    onPress,
    href,
    draggable = false,
    ...props
}: LinkButtonProps) {
    const playPressFeedback = usePressFeedback()

    return (
        <LinkPrimitive
            href={href}
            {...(!nativeLink && {
                "data-slot": "link-button",
                "data-variant": variant,
                "data-size": size
            })}
            {...(openInNewTab && {
                target: "_blank",
                rel: "noreferrer"
            })}
            {...(!mute &&
                (!nativeLink || keepFeedback) && {
                    "data-sound": hoverSound,
                    onPress: (e) => {
                        playPressFeedback(pressSound, haptic)

                        onPress?.(e)
                    }
                })}
            className={cn(
                nativeLink
                    ? className
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
            render={(props) =>
                "href" in props ? (
                    <NextLink {...props} draggable={draggable} />
                ) : (
                    <span {...props} />
                )
            }
        />
    )
}

export type { ButtonProps, HapticVariantsType, LinkButtonProps }
export { Button, buttonVariants, LinkButton }
