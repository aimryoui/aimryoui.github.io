"use client"
import { useRef } from "react"
import NextLink from "next/link"

import { type VariantProps } from "class-variance-authority"
import { type AriaLinkOptions, useLink } from "react-aria/useLink"
import {
    Button as ButtonPrimitive,
    type ButtonProps as ButtonPrimitiveProps
} from "react-aria-components/Button"
import { type defaultPatterns } from "web-haptics"
import { useWebHaptics } from "web-haptics/react"

import { buttonVariants } from "@/components/ui/button-variants"
import { useDevice } from "@/hooks/use-device"
import {
    type HoverSoundType,
    type PressSoundType,
    playPressSound
} from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"

type HapticVariantsType = keyof typeof defaultPatterns

interface ButtonHapticSound {
    haptic?: HapticVariantsType
    hoverSound?: HoverSoundType
    pressSound?: PressSoundType
}

type ButtonProps = Omit<ButtonPrimitiveProps, "className"> &
    React.RefAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> &
    ButtonHapticSound & {
        className?: string
        nativeButton?: boolean
        mute?: boolean
    }

function Button({
    className,
    variant = "default",
    size = "default",
    nativeButton = false,
    haptic = "light",
    hoverSound = "button",
    pressSound = "button",
    mute = false,
    onPress,
    ...props
}: ButtonProps) {
    const { isTouchDevice } = useDevice()
    const { trigger } = useWebHaptics()

    return (
        <ButtonPrimitive
            {...(nativeButton && {
                "data-slot": "button",
                "data-variant": variant,
                "data-size": size
            })}
            data-cursor="target"
            data-sound={hoverSound}
            className={cn(
                nativeButton
                    ? className
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
            onPress={(e) => {
                if (isTouchDevice) {
                    void trigger(haptic)
                } else if (!mute && useAudioStore.getState().isAudioEnabled) {
                    playPressSound(pressSound)
                }

                onPress?.(e)
            }}
        />
    )
}

type NextLinkProps = React.ComponentProps<typeof NextLink>

type LinkButtonProps = Omit<NextLinkProps, "href" | keyof AriaLinkOptions> &
    Omit<AriaLinkOptions, "href"> &
    VariantProps<typeof buttonVariants> &
    ButtonHapticSound & {
        className?: string
        nativeLink?: boolean
        mute?: boolean
        href: NextLinkProps["href"]
        ref?: React.RefObject<HTMLAnchorElement | null>
    }

function LinkButton({
    className,
    variant = "default",
    size = "default",
    nativeLink = false,
    haptic = "medium",
    hoverSound = "button",
    pressSound = "button",
    mute = false,
    onPress,
    href,
    draggable = false,
    ref,
    ...props
}: LinkButtonProps) {
    const { isTouchDevice } = useDevice()
    const { trigger } = useWebHaptics()

    const defaultRef = useRef<HTMLAnchorElement>(null)
    const domRef = ref ?? defaultRef

    const { linkProps } = useLink(
        {
            ...props,
            elementType: "a",
            href:
                typeof href === "string"
                    ? href
                    : (href.href ?? href.pathname ?? ""),
            onPress: (e) => {
                if (isTouchDevice) {
                    void trigger(haptic)
                } else if (!mute && useAudioStore.getState().isAudioEnabled) {
                    playPressSound(pressSound)
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
                "data-size": size,
                "data-sound": { hoverSound }
            })}
            className={cn(
                nativeLink
                    ? className
                    : buttonVariants({ variant, size, className })
            )}
        />
    )
}

export type { ButtonProps, HapticVariantsType, LinkButtonProps }
export { Button, buttonVariants, LinkButton }
