"use client"

import NextLink from "next/link"

import { cva, type VariantProps } from "class-variance-authority"
import {
    Button as ButtonPrimitive,
    type ButtonProps as ButtonPrimitiveProps
} from "react-aria-components/Button"
import {
    Link as LinkPrimitive,
    type LinkProps as LinkPrimitiveProps
} from "react-aria-components/Link"
import { type defaultPatterns } from "web-haptics"

import { usePressFeedback } from "@/hooks/use-press-feedback"
import { type HoverSoundType, type PressSoundType } from "@/lib/sounds"
import { cn } from "@/lib/utils"

const nativeButtonClassName = cn(
    "shrink-0 cursor-pointer select-none",
    {
        "aria-invalid":
            "border-destructive ring-destructive/20 dark:ring-destructive/40",
        "focus-visible":
            "text-foreground shadow-[0_0_0_.3125rem] shadow-highlighted/30 -outline-offset-1 !outline-highlighted outline",
        disabled: "pointer-events-none cursor-not-allowed opacity-40"
    }
)

const buttonVariants = cva(
    cn(
        nativeButtonClassName,
        "inline-flex items-center justify-center gap-2 rounded-xlg text-sm whitespace-nowrap will-change-transform font-wght-500 transition-transform",
        {
            "data-[cursor=target]":
                "transition-[transform,translate,scale,border-radius] ease-spring duration-200",
            hover: {
                "data-[cursor=target]": "rounded-none"
            },
            active: "not-aria-[haspopup]:translate-y-px",
            "[&_svg:not([class*='size-'])]": "size-4",
            "[&_svg]": "pointer-events-none shrink-0"
        }
    ),
    {
        variants: {
            variant: {
                default: cn("bg-primary text-primary-foreground", {
                    hover: "hover:bg-primary/90"
                }),
                secondary: cn("bg-secondary text-secondary-foreground", {
                    hover: "bg-secondary/80",
                    "aria-expanded": "bg-secondary text-secondary-foreground"
                }),
                outline: cn("border border-stroke bg-background", {
                    hover: "bg-element-hover text-foreground",
                    active: "bg-muted",
                    "aria-expanded": "bg-muted text-foreground"
                }),
                tinted: cn("bg-default/10", {
                    hover: "bg-default/15 text-foreground",
                    active: "bg-default/20",
                    "aria-expanded": "bg-default/20 text-foreground"
                }),
                ghost: cn({
                    hover: "bg-accent text-foreground",
                    "aria-expanded": "bg-muted text-foreground"
                }),
                destructive: cn("bg-destructive text-white", {
                    hover: "bg-destructive/90",
                    "focus-visible": "ring-destructive/20",
                    dark: [
                        "bg-destructive/80",
                        {
                            hover: "bg-destructive",
                            "focus-visible": "ring-destructive/40"
                        }
                    ]
                }),
                link: cn("text-primary underline-offset-4", {
                    hover: "underline"
                })
            },
            size: {
                default:
                    "h-9 min-w-9 px-4 py-2 has-[>svg]:px-3 lg:h-[36px] lg:min-w-[36px]",
                lg: "h-10 min-w-10 rounded-md px-6 has-[>svg]:px-4",
                sm: "h-8 min-w-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
                icon: "size-9 text-muted-foreground lg:size-[36px]",
                "icon-sm": "size-8 text-muted-foreground",
                "icon-lg": "size-10 text-muted-foreground",
                "icon-xl": "size-12 text-muted-foreground"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

type ButtonVariantsType = VariantProps<typeof buttonVariants>
type HapticVariantsType = keyof typeof defaultPatterns

interface ButtonFeedback {
    haptic?: HapticVariantsType
    hoverSound?: HoverSoundType
    pressSound?: PressSoundType
}

type ButtonProps = ButtonPrimitiveProps &
    ButtonVariantsType &
    ButtonFeedback & {
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
                    ? [nativeButtonClassName, className]
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
        />
    )
}

type NextLinkProps = React.ComponentProps<typeof NextLink>

type LinkButtonProps = LinkPrimitiveProps &
    Omit<NextLinkProps, "href"> &
    ButtonVariantsType &
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
    scroll = true,
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
            data-cursor="target"
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
                    ? [nativeButtonClassName, className]
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
            render={(props) =>
                "href" in props ? (
                    <NextLink
                        scroll={scroll}
                        {...props}
                        draggable={draggable}
                    />
                ) : (
                    <span {...props} />
                )
            }
        />
    )
}

export type { ButtonProps, HapticVariantsType, LinkButtonProps }
export { Button, buttonVariants, LinkButton }
