"use client"

import { useEffect, useRef, useState, ViewTransition } from "react"

import { ExternalLink } from "lucide-react"

import { LinkButton, type LinkButtonProps } from "@/components/ui/button"
import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"
import {
    resolveSocialData,
    type SocialData
} from "@/portfolio/_helpers/resolve-social-data"
import { type ProjectId } from "@/types/project-ids"

interface SocialType {
    socialType?: "behance" | "dribbble" | "product-website"
}

interface SocialButtonProps extends Omit<LinkButtonProps, "href"> {
    projectId: ProjectId
    social?: SocialData
    isSelectedWorks: boolean
}

const INITIAL_DELAY = 1000
const FEEDBACK_DELAY = 75
const SCROLL_UP_PX_THRESHOLD = 500

function SocialButton({
    className,
    projectId,
    social,
    isSelectedWorks,
    onHoverStart,
    onHoverEnd,
    tracking,
    ...props
}: SocialButtonProps) {
    const { isWebKit } = useBrowserEngine()

    const playPressFeedback = usePressFeedback()
    const isReducedMotion = useReducedMotion()

    const isLg = useMediaQuery("lg")

    const [isExpanded, setIsExpanded] = useState(false)
    const [isAtBottom, setIsAtBottom] = useState(false)

    const hoverTimeoutRef = useRef<NodeJS.Timeout>(undefined)

    const handleHoverStart: SocialButtonProps["onHoverStart"] = (e) => {
        if (isExpanded) return

        hoverTimeoutRef.current = setTimeout(() => {
            playPressFeedback(isReducedMotion ? "button" : "zoom-out")
        }, FEEDBACK_DELAY)

        onHoverStart?.(e)
    }

    const handleHoverEnd: SocialButtonProps["onHoverEnd"] = (e) => {
        clearTimeout(hoverTimeoutRef.current)

        onHoverEnd?.(e)
    }

    useEffect(() => {
        let lastScrollY = window.scrollY
        let accumulatedScrollUp = 0
        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            const atBottom =
                currentScrollY + windowHeight >= documentHeight - 10

            setIsAtBottom(atBottom)

            if (atBottom) {
                setIsExpanded(true)
                accumulatedScrollUp = 0
            } else if (currentScrollY <= 0) {
                setIsExpanded(true)
                accumulatedScrollUp = 0
            } else {
                const delta = currentScrollY - lastScrollY

                if (isLg) {
                    if (delta > 0) {
                        setIsExpanded(false)
                        accumulatedScrollUp = 0
                    } else if (delta < 0) {
                        accumulatedScrollUp += Math.abs(delta)

                        if (accumulatedScrollUp >= SCROLL_UP_PX_THRESHOLD) {
                            setIsExpanded(true)
                        }
                    }
                } else if (delta !== 0) {
                    setIsExpanded(false)
                }
            }

            lastScrollY = currentScrollY

            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                accumulatedScrollUp = 0
            }, 150)
        }

        const initialTrigger = setTimeout(() => {
            lastScrollY = window.scrollY

            setIsExpanded(true)

            handleScroll()

            window.addEventListener("scroll", handleScroll, { passive: true })
        }, INITIAL_DELAY)

        return () => {
            clearTimeout(initialTrigger)
            clearTimeout(scrollTimeout)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [isLg])

    useEffect(() => {
        if (isExpanded) {
            const timeout = setTimeout(() => {
                playPressFeedback(isReducedMotion ? "button" : "zoom-out")
            }, FEEDBACK_DELAY)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [isExpanded, isReducedMotion, playPressFeedback])

    const socialData = resolveSocialData(social)
    if (!socialData) return null
    const { type, url, label, icon: SocialIcon, color } = socialData

    const socialColors = [color.default, color.hover]

    return (
        <ViewTransition
            name={`project-${projectId}-social-button${isSelectedWorks ? "-selected" : ""}`}
        >
            {isWebKit ? (
                <LinkButton
                    data-cursor="ignore"
                    data-expanded={isExpanded}
                    href={url}
                    openInNewTab
                    nativeLink
                    keepFeedback
                    hoverSound={isExpanded ? "button" : false}
                    pressSound="link"
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    tracking={{
                        eventName: tracking?.eventName ?? "click_social_button",
                        eventParams: {
                            platform: type,
                            url,
                            ...(projectId && { project_id: projectId }),
                            ...tracking?.eventParams
                        }
                    }}
                    className={cn(
                        "group pointer-events-auto flex h-9 w-fit items-center justify-end gap-2 text-sm text-white font-wght-500",
                        {
                            "motion-preferred":
                                "transition-transform ease-spring duration-400",
                            lg: [
                                "font-wght-600",
                                isAtBottom && "-translate-x-safe-zone"
                            ]
                        },
                        className
                    )}
                    style={{
                        viewTransitionName: "none !important"
                    }}
                    {...props}
                >
                    <div
                        className={cn(
                            socialColors,
                            "grid h-9 translate-x-11 items-center overflow-clip rounded-full border border-white/15 px-0 opacity-0",
                            "grid-cols-[0fr]",
                            {
                                hover: "underline decoration-solid",
                                "motion-preferred": [
                                    "will-change-[transform,grid-template-columns,opacity,padding] transition-[transform,grid-template-columns,opacity,padding] ease-spring duration-400",
                                    {
                                        "group-hover": "delay-75",
                                        "group-data-[expanded=true]": "delay-75"
                                    }
                                ],
                                "group-hover":
                                    "translate-x-0 grid-cols-[1fr] pe-3 ps-3.5 opacity-100",
                                "group-data-[expanded=true]":
                                    "translate-x-0 grid-cols-[1fr] pe-3 ps-3.5 opacity-100",

                                xs: "hidden"
                            }
                        )}
                    >
                        <div className="min-w-0">
                            <span className="flex w-max items-center justify-end gap-x-1.5">
                                {label}
                                <ExternalLink className="mb-0.75 size-4" />
                            </span>
                        </div>
                    </div>
                    <div
                        className={cn(
                            socialColors,
                            "z-1 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15",
                            "will-change-transform transition-[transform,translate,background-color] duration-100",
                            {
                                "motion-preferred": {
                                    "group-hover":
                                        "animate-social-button-shake-in",
                                    "group-data-[expanded=true]":
                                        "animate-social-button-shake-in"
                                },
                                xs: "!animate-none"
                            }
                        )}
                    >
                        <SocialIcon
                            className={cn(
                                "size-5.5",
                                type === "behance" && "mb-[1px] ml-[1px]"
                            )}
                        />
                    </div>
                </LinkButton>
            ) : (
                <LinkButton
                    data-cursor="ignore"
                    data-expanded={isExpanded}
                    href={url}
                    nativeLink
                    openInNewTab
                    keepFeedback
                    hoverSound={isExpanded ? "button" : false}
                    pressSound="link"
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    tracking={{
                        eventName: tracking?.eventName ?? "click_social_button",
                        eventParams: {
                            platform: type,
                            url,
                            ...(projectId && { project_id: projectId }),
                            ...tracking?.eventParams
                        }
                    }}
                    className={cn(
                        "group pointer-events-auto relative flex h-9 w-fit items-center justify-end gap-1 text-sm text-white font-wght-500",
                        "[filter:drop-shadow(0px_0px_3px_rgba(0,0,0,0.16))_drop-shadow(0px_0px_1.5px_rgba(0,0,0,0.10))]",
                        {
                            "motion-preferred":
                                "transition-transform ease-spring duration-400",
                            lg: [
                                "font-wght-600",
                                isAtBottom && "-translate-x-safe-zone"
                            ]
                        },
                        className
                    )}
                    style={{
                        viewTransitionName: "none !important"
                    }}
                    {...props}
                >
                    <div
                        aria-hidden={true}
                        role="presentation"
                        className={cn(
                            "pointer-events-none absolute inset-0 z-0 flex items-center justify-end gap-1 [filter:url(#metaball)]",
                            {
                                xs: "hidden"
                            }
                        )}
                    >
                        <div
                            className={cn(
                                socialColors,
                                "grid h-8.5 translate-x-10 items-center overflow-clip rounded-full px-0 text-transparent",
                                "will-change-[transform,grid-template-columns,padding] transition-[transform,grid-template-columns,padding] ease-spring duration-400",
                                "grid-cols-[0fr]",
                                {
                                    "motion-reduced": "transition-none",
                                    "group-hover":
                                        "translate-x-0 grid-cols-[1fr] pe-3 ps-4 delay-75",
                                    "group-data-[expanded=true]":
                                        "translate-x-0 grid-cols-[1fr] pe-3 ps-4 delay-75"
                                }
                            )}
                        >
                            <div className="invisible min-w-0 opacity-0">
                                <div className="flex w-max items-center justify-end gap-x-1.5">
                                    {label}
                                    <div className="size-4 -translate-y-0.25" />
                                </div>
                            </div>
                        </div>
                        <div
                            className={cn(
                                socialColors,
                                "-mr-0.5 size-9.5 shrink-0 rounded-full will-change-transform",
                                {
                                    "motion-preferred": {
                                        "group-hover":
                                            "animate-social-button-shake-in",
                                        "group-data-[expanded=true]":
                                            "animate-social-button-shake-in"
                                    }
                                }
                            )}
                        />
                    </div>

                    <div
                        className={cn(
                            "relative z-10 grid h-9 translate-x-10 items-center overflow-clip rounded-full px-0",
                            "grid-cols-[0fr]",
                            {
                                hover: "underline decoration-solid",
                                "motion-preferred": [
                                    "will-change-[transform,grid-template-columns,padding] transition-[transform,grid-template-columns,padding] ease-spring duration-400",
                                    {
                                        "group-hover": "delay-75",
                                        "group-data-[expanded=true]": "delay-75"
                                    }
                                ],
                                "group-hover":
                                    "translate-x-0 grid-cols-[1fr] pe-3 ps-4",
                                "group-data-[expanded=true]":
                                    "translate-x-0 grid-cols-[1fr] pe-3 ps-4",
                                xs: "hidden"
                            }
                        )}
                    >
                        <div className="min-w-0">
                            <span
                                className={cn(
                                    "flex w-max items-center justify-end gap-1.5 opacity-0",
                                    {
                                        "motion-preferred":
                                            "transition-opacity ease-spring duration-400",
                                        "group-hover": "opacity-100",
                                        "group-data-[expanded=true]":
                                            "opacity-100"
                                    }
                                )}
                            >
                                {label}
                                <ExternalLink className="size-4 -translate-y-0.25" />
                            </span>
                        </div>
                    </div>

                    <div
                        className={cn(
                            socialColors,
                            "relative z-20 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15 will-change-transform",
                            "transition-[border-color] duration-1000",
                            {
                                "motion-preferred": {
                                    "group-hover":
                                        "animate-social-button-shake-in",
                                    "group-data-[expanded=true]":
                                        "animate-social-button-shake-in"
                                },
                                "group-hover":
                                    "border-transparent transition-none",
                                "group-data-[expanded=true]":
                                    "border-transparent transition-none",
                                xs: "!animate-none !border-white/15"
                            }
                        )}
                    >
                        <SocialIcon
                            className={cn(
                                "size-5.5",
                                type === "behance" && "mb-[1px] ml-[1px]"
                            )}
                        />
                    </div>
                </LinkButton>
            )}
        </ViewTransition>
    )
}

export type { SocialType }
export default SocialButton
