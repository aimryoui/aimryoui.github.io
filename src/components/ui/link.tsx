"use client"

import NextLink from "next/link"

import { sendGAEvent } from "@next/third-parties/google"
import {
    Link as LinkPrimitive,
    type LinkProps as LinkPrimitiveProps
} from "react-aria-components"

import {
    type ButtonFeedback,
    nativePressableClassName,
    type TrackingData
} from "@/components/ui/button"
import { useClientSearchParams } from "@/hooks/use-client-search-params"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { cn } from "@/lib/utils"

type NextLinkProps = React.ComponentProps<typeof NextLink>

type LinkProps = Omit<LinkPrimitiveProps, "href">
    & Omit<NextLinkProps, "href">
    & ButtonFeedback & {
        href?: string
        externalLink?: boolean
        openInNewTab?: boolean
        mute?: boolean
        tracking?: TrackingData
    }

function Link({
    className,
    href,
    externalLink = false,
    openInNewTab = false,
    haptic = "light",
    hoverSound = "tick",
    pressSound = "link",
    mute = false,
    tracking,
    onPress,
    onKeyDown,
    scroll = true,
    draggable = false,
    ...props
}: LinkProps) {
    const searchParams = useClientSearchParams()
    const role = searchParams.get("r")

    const playPressFeedback = usePressFeedback()

    const finalHref = externalLink ? href : appendRoleToInternalHref(href, role)

    return (
        <LinkPrimitive
            data-slot="link"
            href={finalHref}
            data-cursor="target"
            {...(openInNewTab && {
                target: "_blank",
                rel: "noreferrer"
            })}
            {...(!mute && {
                "data-sound": hoverSound
            })}
            onPress={(e) => {
                if (!mute) {
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
            className={cn(nativePressableClassName, className)}
            {...props}
            render={(domProps) => {
                if ("href" in domProps && finalHref !== undefined) {
                    const { href: _discardedHref, ...rest } = domProps
                    return (
                        <NextLink
                            scroll={scroll}
                            href={finalHref}
                            {...rest}
                            draggable={draggable}
                        />
                    )
                }
                return <span {...domProps} />
            }}
        />
    )
}

function appendRoleToInternalHref(
    href: string | undefined,
    role: string | null
): string | undefined {
    if (!role || !href) return href

    if (!href.startsWith("/") || href.startsWith("//")) {
        return href
    }

    if (!href.includes("?") && !href.includes("#")) {
        return `${href}?r=${role}`
    }

    try {
        const url = new URL(href, "http://a")
        url.searchParams.set("r", role)
        return url.pathname + url.search + url.hash
    } catch {
        return href
    }
}

export type { LinkProps }
export { Link }
