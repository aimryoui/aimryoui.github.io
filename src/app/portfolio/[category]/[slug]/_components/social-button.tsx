"use client"

import { useEffect, useState } from "react"
import NextLink from "next/link"

import { ExternalLink } from "lucide-react"

import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

function SocialButton({
    className,
    href,
    ...props
}: React.ComponentProps<typeof NextLink>) {
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

    return isBlink ? (
        <NextLink
            data-cursor="ignore"
            data-expanded={isExpanded}
            href={href}
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
                        "flex h-9 w-0 translate-x-11 items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap rounded-full bg-[#0056ff] text-transparent [interpolate-size:allow-keywords]",
                        "transform-gpu will-change-[transform,width,opacity,padding] transition-[transform,width,opacity,padding] ease-spring duration-500",
                        {
                            lg: "h-[36px]",
                            "group-hover":
                                "w-full translate-x-0 bg-[#054cd9] pl-3.5 pr-3 delay-75",
                            "group-data-[expanded=true]":
                                "w-full translate-x-0 bg-[#054cd9] pl-3.5 pr-3 delay-75"
                        }
                    )}
                >
                    View this project on Behance
                    <div className="mb-0.75 size-4 opacity-0 lg:size-5" />
                </span>
                <div
                    className={cn(
                        "-mr-0.5 size-9.5 shrink-0 rounded-full bg-[#0056ff] will-change-transform",
                        "transition-[background-color] duration-100",
                        {
                            lg: "-mr-[2px] size-[38px]",
                            "group-hover":
                                "animate-social-button-shake-in bg-[#054cd9] transition-transform",
                            "group-data-[expanded=true]":
                                "animate-social-button-shake-in bg-[#054cd9] transition-transform"
                        }
                    )}
                />
            </div>

            <span
                className={cn(
                    "relative z-10 flex h-9 w-0 translate-x-11 items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-0 opacity-0 [interpolate-size:allow-keywords]",
                    "will-change-[transform,width,opacity,padding] transition-[transform,width,opacity,padding] ease-spring duration-450",
                    {
                        lg: "h-[36px]",
                        "group-hover":
                            "w-fit translate-x-0 pl-3.5 pr-3 opacity-100 duration-500 delay-75",
                        "group-data-[expanded=true]":
                            "w-fit translate-x-0 pl-3.5 pr-3 opacity-100 duration-500 delay-75"
                    }
                )}
            >
                View this project on Behance
                <ExternalLink className="mb-0.75 size-4 lg:size-5" />
            </span>
            <div
                className={cn(
                    "relative z-20 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15 will-change-transform transition-[border-color] duration-1000",
                    {
                        lg: "-mr-[2px] size-[38px]",
                        "group-hover":
                            "animate-social-button-shake-in border-transparent transition-transform",
                        "group-data-[expanded=true]":
                            "animate-social-button-shake-in border-transparent transition-transform"
                    }
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                    className="mb-[1px] ml-[1px] size-5.5 lg:size-6"
                >
                    <path
                        fill="currentColor"
                        d="M12.662 8.672c1.077 0 2.061.096 2.951.286.89.19 1.65.502 2.284.936a4.367 4.367 0 0 1 1.476 1.73c.35.72.524 1.608.524 2.666 0 1.142-.26 2.094-.778 2.855-.518.762-1.286 1.386-2.3 1.872 1.396.402 2.438 1.106 3.126 2.11.688 1.004 1.032 2.216 1.032 3.634 0 1.142-.222 2.132-.666 2.968a5.76 5.76 0 0 1-1.794 2.046c-.752.53-1.608.92-2.57 1.174a11.6 11.6 0 0 1-2.966.38H2V8.672h10.662Zm-.635 9.17c.888 0 1.618-.213 2.19-.635.572-.424.858-1.11.856-2.062 0-.527-.096-.961-.286-1.3a2.107 2.107 0 0 0-.762-.793 3.224 3.224 0 0 0-1.094-.396 7.28 7.28 0 0 0-1.285-.11H6.984v5.3l5.043-.005Zm.287 9.613c.47.002.937-.046 1.395-.142a3.441 3.441 0 0 0 1.174-.476c.338-.222.608-.524.81-.904.2-.38.302-.868.302-1.46 0-1.162-.328-1.994-.984-2.49-.656-.498-1.524-.746-2.601-.746H6.983v6.22l5.33-.002Zm14.93-.476c.677.656 1.65.984 2.92.984.91 0 1.692-.228 2.348-.682.656-.454 1.058-.936 1.206-1.444h3.966c-.634 1.968-1.608 3.374-2.92 4.22-1.312.846-2.898 1.27-4.76 1.27-1.29 0-2.453-.206-3.49-.618a7.258 7.258 0 0 1-2.633-1.762 7.89 7.89 0 0 1-1.666-2.728c-.39-1.058-.586-2.222-.586-3.49 0-1.226.2-2.368.602-3.426a8.04 8.04 0 0 1 1.714-2.744 8.057 8.057 0 0 1 2.65-1.823c1.026-.444 2.164-.666 3.412-.666 1.395 0 2.611.27 3.65.81a7.285 7.285 0 0 1 2.553 2.173 8.936 8.936 0 0 1 1.444 3.11c.296 1.164.402 2.38.318 3.65H26.137c.062 1.454.432 2.512 1.108 3.166Zm5.094-8.63c-.54-.592-1.36-.888-2.46-.888-.72 0-1.317.122-1.791.364-.476.244-.856.544-1.142.904-.286.36-.486.74-.602 1.142a5.133 5.133 0 0 0-.206 1.078h7.33c-.215-1.14-.59-2.008-1.129-2.6Zm-6.973-8.527h9.157v2.54h-9.157v-2.54Z"
                    />
                </svg>
            </div>
        </NextLink>
    ) : (
        <NextLink
            data-cursor="ignore"
            data-expanded={isExpanded}
            href={href}
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
                    "flex h-9 w-0 translate-x-11 items-center justify-end gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-white/15 bg-[#0056ff] px-0 opacity-0",
                    "will-change-[transform,width,opacity,padding] transition-[transform,width,opacity,padding] ease-spring duration-400",
                    {
                        lg: "h-[36px]",
                        "group-hover":
                            "w-fit translate-x-0 bg-[#054cd9] px-3 opacity-100 delay-75",
                        "group-data-[expanded=true]":
                            "w-fit translate-x-0 bg-[#054cd9] px-3 opacity-100 delay-75"
                    }
                )}
            >
                View this project on Behance
                <ExternalLink className="mb-0.75 size-4 lg:size-5" />
            </span>
            <div
                className={cn(
                    "z-1 -mr-0.5 grid size-9.5 shrink-0 place-items-center rounded-full border border-white/15 bg-[#0056ff] will-change-transform",
                    "transition-[background-color] duration-100",
                    {
                        lg: "-mr-[2px] size-[38px]",
                        "group-hover":
                            "animate-social-button-shake-in bg-[#054cd9] transition-transform",
                        "group-data-[expanded=true]":
                            "animate-social-button-shake-in bg-[#054cd9] transition-transform"
                    }
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                    className="mb-[1px] ml-[1px] size-5.5 lg:size-6"
                >
                    <path
                        fill="currentColor"
                        d="M12.662 8.672c1.077 0 2.061.096 2.951.286.89.19 1.65.502 2.284.936a4.367 4.367 0 0 1 1.476 1.73c.35.72.524 1.608.524 2.666 0 1.142-.26 2.094-.778 2.855-.518.762-1.286 1.386-2.3 1.872 1.396.402 2.438 1.106 3.126 2.11.688 1.004 1.032 2.216 1.032 3.634 0 1.142-.222 2.132-.666 2.968a5.76 5.76 0 0 1-1.794 2.046c-.752.53-1.608.92-2.57 1.174a11.6 11.6 0 0 1-2.966.38H2V8.672h10.662Zm-.635 9.17c.888 0 1.618-.213 2.19-.635.572-.424.858-1.11.856-2.062 0-.527-.096-.961-.286-1.3a2.107 2.107 0 0 0-.762-.793 3.224 3.224 0 0 0-1.094-.396 7.28 7.28 0 0 0-1.285-.11H6.984v5.3l5.043-.005Zm.287 9.613c.47.002.937-.046 1.395-.142a3.441 3.441 0 0 0 1.174-.476c.338-.222.608-.524.81-.904.2-.38.302-.868.302-1.46 0-1.162-.328-1.994-.984-2.49-.656-.498-1.524-.746-2.601-.746H6.983v6.22l5.33-.002Zm14.93-.476c.677.656 1.65.984 2.92.984.91 0 1.692-.228 2.348-.682.656-.454 1.058-.936 1.206-1.444h3.966c-.634 1.968-1.608 3.374-2.92 4.22-1.312.846-2.898 1.27-4.76 1.27-1.29 0-2.453-.206-3.49-.618a7.258 7.258 0 0 1-2.633-1.762 7.89 7.89 0 0 1-1.666-2.728c-.39-1.058-.586-2.222-.586-3.49 0-1.226.2-2.368.602-3.426a8.04 8.04 0 0 1 1.714-2.744 8.057 8.057 0 0 1 2.65-1.823c1.026-.444 2.164-.666 3.412-.666 1.395 0 2.611.27 3.65.81a7.285 7.285 0 0 1 2.553 2.173 8.936 8.936 0 0 1 1.444 3.11c.296 1.164.402 2.38.318 3.65H26.137c.062 1.454.432 2.512 1.108 3.166Zm5.094-8.63c-.54-.592-1.36-.888-2.46-.888-.72 0-1.317.122-1.791.364-.476.244-.856.544-1.142.904-.286.36-.486.74-.602 1.142a5.133 5.133 0 0 0-.206 1.078h7.33c-.215-1.14-.59-2.008-1.129-2.6Zm-6.973-8.527h9.157v2.54h-9.157v-2.54Z"
                    />
                </svg>
            </div>
        </NextLink>
    )
}

export default SocialButton
