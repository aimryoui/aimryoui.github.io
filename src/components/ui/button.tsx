"use client"
import { useRef } from "react"
import NextLink from "next/link"

import { useLink } from "@react-aria/link"
import { type VariantProps } from "class-variance-authority"
import {
    Button as ButtonPrimitive,
    type ButtonProps as ButtonPrimitiveProps,
    type PressEvent
} from "react-aria-components/Button"
import { type defaultPatterns } from "web-haptics"
import { useWebHaptics } from "web-haptics/react"

import { buttonVariants } from "@/components/ui/button-variants"
import { useDevice } from "@/hooks/use-device"
import { playPressSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"

type HapticVariantsType = keyof typeof defaultPatterns

function Button({
    className,
    variant = "default",
    size = "default",
    haptic = "light",
    mute = false,
    onPress,
    ...props
}: Omit<ButtonPrimitiveProps, "className"> &
    React.RefAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        className?: string
        haptic?: HapticVariantsType
        mute?: boolean
    }) {
    const { isTouchDevice } = useDevice()
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
                if (isTouchDevice) {
                    void trigger(haptic)
                } else if (!mute && useAudioStore.getState().isAudioEnabled) {
                    playPressSound()
                }

                onPress?.(e)
            }}
        />
    )
}

type NextLinkProps = React.ComponentProps<typeof NextLink>

type LinkButtonProps = NextLinkProps &
    VariantProps<typeof buttonVariants> & {
        className?: string
        nativeLink?: boolean
        haptic?: HapticVariantsType
        mute?: boolean
        onPress?: (e: PressEvent) => void
        ref?: React.Ref<HTMLAnchorElement>
    }

function LinkButton({
    className,
    variant = "default",
    size = "default",
    nativeLink = false,
    haptic = "medium",
    mute = false,
    onPress,
    href,
    draggable = false,
    ref,
    ...props
}: LinkButtonProps) {
    const { isTouchDevice } = useDevice()
    const { trigger } = useWebHaptics()

    const fallbackRef = useRef<HTMLAnchorElement>(null)
    const domRef = (ref ?? fallbackRef) as React.RefObject<HTMLAnchorElement>

    const { linkProps } = useLink(
        {
            elementType: "a",
            href: typeof href === "string" ? href : (href.href ?? ""),
            onPress: (e) => {
                if (isTouchDevice) {
                    void trigger(haptic)
                } else if (!mute && useAudioStore.getState().isAudioEnabled) {
                    playPressSound()
                }
                onPress?.(e)
            }
        },
        domRef
    )

    return (
        <NextLink
            href={href}
            draggable={draggable}
            {...props}
            {...linkProps}
            ref={domRef}
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
        />
    )
}

export type { HapticVariantsType }
export { Button, buttonVariants, LinkButton }
