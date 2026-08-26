"use client"

import NextLinkPrimitive from "next/link"

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
import { ROLE_QUERY_PARAM_KEY } from "@/configs/role.config"
import { useClientSearchParams } from "@/hooks/use-client-search-params"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { cn } from "@/lib/utils"

type NextLinkPrimitiveProps = React.ComponentProps<typeof NextLinkPrimitive>

type LinkProps = Omit<LinkPrimitiveProps, "href">
    & Omit<NextLinkPrimitiveProps, "href">
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
    ...props
}: LinkProps) {
    const searchParams = useClientSearchParams()
    const role = searchParams.get(ROLE_QUERY_PARAM_KEY)

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
                        <NextLinkPrimitive
                            scroll={scroll}
                            href={finalHref}
                            {...rest}
                            draggable={false}
                        />
                    )
                }
                return <span {...domProps} />
            }}
        />
    )
}

type NextLinkProps = Omit<NextLinkPrimitiveProps, "href">
    & ButtonFeedback & {
        href: string
        externalLink?: boolean
        openInNewTab?: boolean
        mute?: boolean
        tracking?: TrackingData
    }

function NextLink({
    className,
    href,
    externalLink = false,
    openInNewTab = false,
    haptic = "light",
    hoverSound = "tick",
    pressSound = "link",
    mute = false,
    tracking,
    onClick,
    scroll = true,
    ...props
}: NextLinkProps) {
    const searchParams = useClientSearchParams()
    const role = searchParams.get(ROLE_QUERY_PARAM_KEY)

    const playPressFeedback = usePressFeedback()

    const finalHref = externalLink ? href : appendRoleToInternalHref(href, role)

    return (
        <NextLinkPrimitive
            data-slot="link"
            data-cursor="target"
            href={finalHref ?? "#"}
            scroll={scroll}
            {...(openInNewTab && {
                target: "_blank",
                rel: "noreferrer"
            })}
            {...(!mute && {
                "data-sound": hoverSound
            })}
            onClick={(e) => {
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

                onClick?.(e)
            }}
            className={cn(nativePressableClassName, className)}
            {...props}
            draggable={false}
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
        return `${href}?${ROLE_QUERY_PARAM_KEY}=${role}`
    }

    try {
        const url = new URL(href, "http://a")
        url.searchParams.set(ROLE_QUERY_PARAM_KEY, role)
        return url.pathname + url.search + url.hash
    } catch {
        return href
    }
}

export type { LinkProps, NextLinkProps }
export { Link, NextLink }
