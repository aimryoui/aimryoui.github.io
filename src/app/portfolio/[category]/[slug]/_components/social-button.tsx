"use client"

import { useEffect, useState } from "react"
import NextLink from "next/link"

import { ExternalLink } from "lucide-react"

import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import {
    resolveSocialData,
    type SocialData
} from "@/portfolio/_helpers/resolve-social-data"

interface SocialType {
    socialType?: "behance" | "dribbble" | "product-website"
}

interface SocialButtonProps extends Omit<
    React.ComponentProps<typeof NextLink>,
    "href"
> {
    social?: SocialData
}

const SCROLL_UP_PX_THRESHOLD = 500

function SocialButton({ className, social, ...props }: SocialButtonProps) {
    const { isWebKit } = useBrowserEngine()

    const isMobile = useMediaQuery("lg")
    const [isScrolledUp, setIsScrolledUp] = useState(false)
    const [isAtBottom, setIsAtBottom] = useState(false)

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
                setIsScrolledUp(true)
                accumulatedScrollUp = 0
            } else if (currentScrollY <= 0) {
                setIsScrolledUp(true)
                accumulatedScrollUp = 0
            } else {
                const delta = currentScrollY - lastScrollY

                if (isMobile) {
                    if (delta > 0) {
                        setIsScrolledUp(false)
                        accumulatedScrollUp = 0
                    } else if (delta < 0) {
                        accumulatedScrollUp += Math.abs(delta)

                        if (accumulatedScrollUp >= SCROLL_UP_PX_THRESHOLD) {
                            setIsScrolledUp(true)
                        }
                    }
                } else {
                    setIsScrolledUp(false)
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

            handleScroll()

            window.addEventListener("scroll", handleScroll, { passive: true })
        }, 800)

        return () => {
            clearTimeout(initialTrigger)
            clearTimeout(scrollTimeout)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [isMobile])

    const isExpanded = isScrolledUp

    const socialData = resolveSocialData(social)
    if (!socialData) return null
    const { type, url, label, icon: SocialIcon, color } = socialData

    const socialColors = [color.default, color.hover]

    return isWebKit ? (
        <NextLink
            data-cursor="ignore"
            data-expanded={isExpanded}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(
                "group pointer-events-auto flex h-9 w-fit items-center justify-end gap-2.5 text-sm text-white font-wght-500",
                "will-change-transform transition-transform ease-spring duration-400",
                isAtBottom && isMobile && "-translate-x-5.5",
                {
                    lg: "text-base font-wght-600"
                },
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    socialColors,
                    "grid h-9 translate-x-11 items-center overflow-clip rounded-full border border-white/15 px-0 opacity-0",
                    "will-change-[transform,grid-template-columns,opacity,padding] transition-[transform,grid-template-columns,opacity,padding] ease-spring duration-500",
                    "grid-cols-[0fr]",
                    {
                        hover: "underline decoration-solid",
                        lg: "h-[36px]",
                        "group-hover":
                            "translate-x-0 grid-cols-[1fr] pe-3 ps-3.5 opacity-100 delay-75",
                        "group-data-[expanded=true]":
                            "translate-x-0 grid-cols-[1fr] pe-3 ps-3.5 opacity-100 delay-75"
                    }
                )}
            >
                <div className="min-w-0">
                    <span className="flex w-max items-center justify-end gap-1.5">
                        {label}
                        <ExternalLink className="mb-0.75 size-4 lg:size-5" />
                    </span>
                </div>
            </div>
            <div
                className={cn(
                    socialColors,
                    "z-1 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15",
                    "will-change-transform transition-[transform,translate,background-color] duration-100",
                    {
                        lg: "-mr-[2px] size-[38px]",
                        "group-hover": "animate-social-button-shake-in",
                        "group-data-[expanded=true]":
                            "animate-social-button-shake-in"
                    }
                )}
            >
                <SocialIcon
                    className={cn(
                        "size-5.5 lg:size-6",
                        type === "behance" && "mb-[1px] ml-[1px]"
                    )}
                />
            </div>
        </NextLink>
    ) : (
        <NextLink
            data-cursor="ignore"
            data-expanded={isExpanded}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(
                "group pointer-events-auto relative flex h-9 w-fit items-center justify-end gap-1 text-sm text-white font-wght-500",
                "[filter:drop-shadow(0px_0px_3px_rgba(0,0,0,0.16))_drop-shadow(0px_0px_1.5px_rgba(0,0,0,0.10))]",
                "will-change-transform transition-transform ease-spring duration-400",
                isAtBottom && "lg:-translate-x-5.5",
                {
                    lg: "text-base"
                },
                className
            )}
            {...props}
        >
            <div
                aria-hidden={true}
                role="presentation"
                className={cn(
                    "pointer-events-none absolute inset-0 z-0 flex items-center justify-end gap-1 [filter:url(#metaball)]"
                )}
            >
                <div
                    className={cn(
                        socialColors,
                        "grid h-9 translate-x-10 items-center overflow-clip rounded-full px-0 text-transparent",
                        "will-change-[transform,grid-template-columns,padding] transition-[transform,grid-template-columns,padding] ease-spring duration-500",
                        "grid-cols-[0fr]",
                        {
                            lg: "h-[36px]",
                            "group-hover":
                                "translate-x-0 grid-cols-[1fr] pe-3 ps-4 delay-75",
                            "group-data-[expanded=true]":
                                "translate-x-0 grid-cols-[1fr] pe-3 ps-4 delay-75"
                        }
                    )}
                >
                    <div className="invisible min-w-0 opacity-0">
                        <div className="flex w-max items-center justify-end gap-1.5">
                            <span className="blink:translate-y-[.5px]">
                                {label}
                            </span>
                            <div className="size-4 -translate-y-0.25 lg:size-5" />
                        </div>
                    </div>
                </div>
                <div
                    className={cn(
                        socialColors,
                        "-mr-0.5 size-9.5 shrink-0 rounded-full will-change-transform",
                        {
                            lg: "-mr-[2px] size-[38px]",
                            "group-hover": "animate-social-button-shake-in",
                            "group-data-[expanded=true]":
                                "animate-social-button-shake-in"
                        }
                    )}
                />
            </div>

            <div
                className={cn(
                    "relative z-10 grid h-9 translate-x-10 items-center overflow-clip rounded-full px-0",
                    "will-change-[transform,grid-template-columns,padding] transition-[transform,grid-template-columns,padding] ease-spring duration-500",
                    "grid-cols-[0fr]",
                    {
                        hover: "underline decoration-solid",
                        lg: "h-[36px]",
                        "group-hover":
                            "translate-x-0 grid-cols-[1fr] pe-3 ps-4 delay-75",
                        "group-data-[expanded=true]":
                            "translate-x-0 grid-cols-[1fr] pe-3 ps-4 delay-75"
                    }
                )}
            >
                <div className="min-w-0">
                    <span
                        className={cn(
                            "flex w-max items-center justify-end gap-1.5 opacity-0 transition-opacity ease-spring duration-500",
                            {
                                "group-hover": "opacity-100",
                                "group-data-[expanded=true]": "opacity-100"
                            }
                        )}
                    >
                        <span className="blink:translate-y-[.5px]">
                            {label}
                        </span>
                        <ExternalLink className="size-4 -translate-y-0.25 lg:size-5" />
                    </span>
                </div>
            </div>
            <div
                className={cn(
                    socialColors,
                    "relative z-20 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15 will-change-transform",
                    "transition-[border-color] duration-1000",
                    {
                        lg: "-mr-[2px] size-[38px]",
                        "group-hover":
                            "animate-social-button-shake-in border-transparent transition-none",
                        "group-data-[expanded=true]":
                            "animate-social-button-shake-in border-transparent transition-none"
                    }
                )}
            >
                <SocialIcon
                    className={cn(
                        "size-5.5 lg:size-6",
                        type === "behance" && "mb-[1px] ml-[1px]"
                    )}
                />
            </div>
        </NextLink>
    )
}

export type { SocialType }
export default SocialButton
