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

function SocialButton({ className, social, ...props }: SocialButtonProps) {
    const { isBlink } = useBrowserEngine()

    const isMobile = useMediaQuery("lg")
    const [isScrolledUp, setIsScrolledUp] = useState(false)
    const [isAtBottom, setIsAtBottom] = useState(false)

    useEffect(() => {
        if (!isMobile) {
            return
        }

        let lastScrollY = window.scrollY

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            const atBottom =
                currentScrollY + windowHeight >= documentHeight - 10

            setIsAtBottom(atBottom)

            if (atBottom) {
                setIsScrolledUp(true)
            } else if (currentScrollY <= 0) {
                setIsScrolledUp(true)
            } else if (currentScrollY > lastScrollY) {
                setIsScrolledUp(false)
            } else if (currentScrollY < lastScrollY) {
                setIsScrolledUp(true)
            }

            lastScrollY = currentScrollY
        }

        const initialTrigger = setTimeout(() => {
            handleScroll()
        }, 800)

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            clearTimeout(initialTrigger)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [isMobile])

    const isExpanded = isMobile ? isScrolledUp : false

    const socialData = resolveSocialData(social)
    if (!socialData) return null
    const { type, url, label, icon: SocialIcon, color } = socialData

    const socialColors = [color.default, color.hover, color.expanded]

    return isBlink ? (
        <NextLink
            data-cursor="ignore"
            data-expanded={isExpanded}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(
                "group pointer-events-auto relative flex h-9 w-fit items-center justify-end gap-2 text-sm text-white font-wght-500 lg:gap-2.5",
                "[filter:drop-shadow(0px_0px_3px_rgba(0,0,0,0.16))_drop-shadow(0px_0px_1.5px_rgba(0,0,0,0.10))]",
                "will-change-transform transition-transform ease-spring duration-400",
                isAtBottom && isMobile && "-translate-x-5",
                className
            )}
            {...props}
        >
            <div
                aria-hidden={true}
                className={cn(
                    "pointer-events-none absolute inset-0 z-0 flex items-center justify-end gap-2 [filter:url(#metaball)] lg:gap-2.5"
                )}
            >
                <span
                    className={cn(
                        socialColors,
                        "flex h-9 w-0 translate-x-11 items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap rounded-full text-transparent [interpolate-size:allow-keywords]",
                        "transform-gpu will-change-[transform,width,opacity,padding] transition-[transform,width,opacity,padding] ease-spring duration-500",
                        {
                            lg: "h-[36px]",
                            "group-hover":
                                "w-full translate-x-0 pl-3.5 pr-3 delay-75",
                            "group-data-[expanded=true]":
                                "w-full translate-x-0 pl-3.5 pr-3 delay-75"
                        }
                    )}
                >
                    {label}
                    <div className="mb-0.75 size-4 opacity-0 lg:size-5" />
                </span>
                <div
                    className={cn(
                        socialColors,
                        "-mr-0.5 size-9.5 shrink-0 rounded-full will-change-transform",
                        "transition-[transform,translate,background-color] duration-100",
                        {
                            lg: "-mr-[2px] size-[38px]",
                            "group-hover": "animate-social-button-shake-in",
                            "group-data-[expanded=true]":
                                "animate-social-button-shake-in"
                        }
                    )}
                />
            </div>

            <span
                className={cn(
                    "relative z-10 flex h-9 w-0 translate-x-11 items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-0 opacity-0",
                    "will-change-[transform,width,opacity,padding] transition-[transform,width,opacity,padding] ease-spring duration-450 [interpolate-size:allow-keywords]",
                    {
                        lg: "h-[36px]",
                        "group-hover":
                            "w-fit translate-x-0 pl-3.5 pr-3 opacity-100 duration-500 delay-75",
                        "group-data-[expanded=true]":
                            "w-fit translate-x-0 pl-3.5 pr-3 opacity-100 duration-500 delay-75"
                    }
                )}
            >
                {label}
                <ExternalLink className="mb-0.75 size-4 lg:size-5" />
            </span>
            <div
                className={cn(
                    "relative z-20 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15",
                    "will-change-transform transition-[transform,translate,border-color] duration-1000",
                    {
                        lg: "-mr-[2px] size-[38px]",
                        "group-hover":
                            "animate-social-button-shake-in border-transparent",
                        "group-data-[expanded=true]":
                            "animate-social-button-shake-in border-transparent"
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
                "group pointer-events-auto ml-auto flex h-9 w-fit items-center justify-end gap-2 text-sm text-white font-wght-500 lg:gap-2.5",
                "will-change-transform transition-transform ease-spring duration-400",
                isAtBottom && isMobile && "-translate-x-5",
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    socialColors,
                    "flex h-9 w-0 translate-x-11 items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-white/15 px-0 opacity-0",
                    "will-change-[transform,width,opacity,padding] transition-[transform,width,opacity,padding] ease-spring duration-400",
                    {
                        lg: "h-[36px]",
                        "group-hover":
                            "w-fit translate-x-0 px-3 opacity-100 delay-75",
                        "group-data-[expanded=true]":
                            "w-fit translate-x-0 px-3 opacity-100 delay-75"
                    }
                )}
            >
                {label}
                <ExternalLink className="mb-0.75 size-4 lg:size-5" />
            </span>
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
    )
}

export type { SocialType }
export default SocialButton
