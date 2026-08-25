"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { cva, type VariantProps } from "class-variance-authority"
import {
    Button as ButtonPrimitive,
    type ButtonProps as ButtonPrimitiveProps
} from "react-aria-components/Button"
import { type defaultPatterns } from "web-haptics"

import { Link } from "@/components/ui/link"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { type HoverSoundType, type PressSoundType } from "@/lib/sounds"
import { cn } from "@/lib/utils"

const nativePressableClassName = cn("shrink-0 cursor-pointer", {
    "aria-invalid":
        "border-destructive ring-destructive/20 dark:ring-destructive/40",
    "focus-visible":
        "text-foreground shadow-[0_0_0_.3125rem] shadow-highlighted/30 -outline-offset-1 outline-highlighted outline",
    disabled: "pointer-events-none cursor-not-allowed opacity-40"
})

const buttonVariants = cva(
    cn(
        nativePressableClassName,
        "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xlg text-sm font-wght-500 transition-[transform,translate,background-color] duration-100",
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
                icon: "size-9 text-muted-foreground",
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
                    ? [nativePressableClassName, className]
                    : buttonVariants({ variant, size, className })
            )}
            {...props}
        />
    )
}

type LinkProps = React.ComponentProps<typeof Link>

type LinkButtonProps = LinkProps & ButtonVariantsType

function LinkButton({
    className,
    variant = "default",
    size = "default",
    haptic = "medium",
    hoverSound = "button",
    pressSound = "button",
    ...props
}: LinkButtonProps) {
    return (
        <Link
            data-slot="link-button"
            data-variant={variant}
            data-size={size}
            haptic={haptic}
            hoverSound={hoverSound}
            pressSound={pressSound}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export type {
    ButtonFeedback,
    ButtonProps,
    ButtonVariantsType,
    HapticVariantsType,
    LinkButtonProps,
    TrackingData
}
export { Button, buttonVariants, LinkButton, nativePressableClassName }
