"use client"

import NextLink from "next/link"

import { sendGAEvent } from "@next/third-parties/google"
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

const nativeButtonClassName = cn("shrink-0 cursor-pointer", {
    "aria-invalid":
        "border-destructive ring-destructive/20 dark:ring-destructive/40",
    "focus-visible":
        "text-foreground shadow-[0_0_0_.3125rem] shadow-highlighted/30 -outline-offset-1 outline-highlighted outline",
    disabled: "pointer-events-none cursor-not-allowed opacity-40"
})

const buttonVariants = cva(
    cn(
        nativeButtonClassName,
        "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xlg text-sm text-muted-foreground font-wght-500 transition-[transform,translate,background-color] duration-100",
        {
            "data-target-cursor":
                "transition-[transform,translate,scale,background-color,border-radius] ease-[linear,linear,linear,linear,cubic-bezier(0.22,1,0.36,1)] duration-[.1s,.1s,.1s,.1s,.2s]",
            hover: {
                "data-target-cursor": "rounded-none"
            },
            active: "not-aria-[haspopup]:motion-preferred:translate-y-px",
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
                tinted: cn("bg-default/[0.075] dark:bg-default/10", {
                    hover: "bg-default/10 text-foreground dark:bg-default/15",
                    active: "bg-default/15 dark:bg-default/20",
                    "aria-expanded": "bg-default/20 text-foreground"
                }),
                ghost: cn("text-muted-foreground", {
                    hover: "bg-accent/60 text-foreground dark:bg-accent",
                    active: "bg-accent/60 text-foreground dark:bg-accent",
                    "aria-expanded": "bg-muted text-foreground"
                }),
                "ghost-highlighted": cn("text-highlighted", {
                    hover: "bg-highlighted/10 transition-none",
                    active: "bg-highlighted/20 transition-none",
                    "aria-expanded": "bg-highlighted/30"
                }),
                destructive: cn("bg-destructive text-white", {
                    hover: "bg-destructive/60",
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
                default: "h-9 min-w-9 px-4 py-2 has-[>svg]:px-3",
                lg: "h-10 min-w-10 rounded-md px-6 has-[>svg]:px-4",
                sm: "h-8 min-w-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
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

type NativeButtonType = Pick<
    React.ComponentPropsWithoutRef<"button">,
    "suppressHydrationWarning"
>
type ButtonVariantsType = VariantProps<typeof buttonVariants>
type HapticVariantsType = keyof typeof defaultPatterns

interface ButtonFeedback {
    haptic?: HapticVariantsType
    hoverSound?: HoverSoundType
    pressSound?: PressSoundType
}

interface TrackingData {
    eventName: string
    eventParams?: Record<string, string | number | boolean>
}

type ButtonProps = NativeButtonType
    & ButtonPrimitiveProps
    & ButtonVariantsType
    & ButtonFeedback & {
        nativeButton?: boolean
        keepFeedback?: boolean
        mute?: boolean
        tracking?: TrackingData
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
    tracking,
    onPress,
    onKeyDown,
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
            {...(!mute
                && (!nativeButton || keepFeedback) && {
                    "data-sound": hoverSound
                })}
            onPress={(e) => {
                if (!mute && (!nativeButton || keepFeedback)) {
                    playPressFeedback(pressSound, haptic)
                }

                if (tracking) {
                    sendGAEvent(
                        "event",
                        tracking.eventName,
                        tracking.eventParams ?? {}
                    )
                }

                onPress?.(e)
            }}
            onKeyDown={
                onKeyDown
                    ? (e) => {
                          Object.defineProperty(e, "stopPropagation", {
                              value: () => {},
                              writable: true,
                              configurable: true
                          })
                          onKeyDown(e)
                      }
                    : undefined
            }
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

type LinkButtonProps = LinkPrimitiveProps
    & Omit<NextLinkProps, "href">
    & ButtonVariantsType
    & ButtonFeedback & {
        nativeLink?: boolean
        keepFeedback?: boolean
        openInNewTab?: boolean
        mute?: boolean
        tracking?: TrackingData
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
    tracking,
    onPress,
    onKeyDown,
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
            {...(!mute
                && (!nativeLink || keepFeedback) && {
                    "data-sound": hoverSound
                })}
            onPress={(e) => {
                if (!mute && (!nativeLink || keepFeedback)) {
                    playPressFeedback(pressSound, haptic)
                }

                if (tracking) {
                    sendGAEvent(
                        "event",
                        tracking.eventName,
                        tracking.eventParams ?? {}
                    )
                }

                onPress?.(e)
            }}
            onKeyDown={
                onKeyDown
                    ? (e) => {
                          Object.defineProperty(e, "stopPropagation", {
                              value: () => {},
                              writable: true,
                              configurable: true
                          })
                          onKeyDown(e)
                      }
                    : undefined
            }
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

export type { ButtonProps, HapticVariantsType, LinkButtonProps, TrackingData }
export { Button, buttonVariants, LinkButton }
