"use client"

import { Fragment, useRef } from "react"
import { usePathname } from "next/navigation"

import { Divider } from "@/components/layout/divider"
import {
    ElementLine,
    SectionLine,
    SvgElementLine
} from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Link } from "@/components/ui/link"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { siteConfig } from "@/configs/site.config"
import { useBrowserEngine } from "@/hooks/use-browser-engine"
import { useContainerQuery } from "@/hooks/use-container-query"
import { cn } from "@/lib/utils"
import {
    CONTACT_METHODS,
    type ContactMethodDetails
} from "@/portfolio/_configs/contact-methods"

const ALL_PLATFORMS = CONTACT_METHODS.flatMap((method) => method.platforms)

const CURRENT_YEAR = new Date().getFullYear()

function Footer({ hasSocialLinks = false }: { hasSocialLinks?: boolean }) {
    const pathName = usePathname()

    const containerRef = useRef<HTMLElement>(null)

    return (
        <footer
            ref={containerRef}
            className={cn("flex flex-col bg-background @container", {
                lg: "flex-col-reverse"
            })}
        >
            <Space
                className={cn(
                    "hidden h-[--toolbar-height]",
                    pathName !== "/portfolio"
                        && "md:h-[calc(var(--toolbar-height)+var(--spacing)*10+var(--px)/2)]",
                    {
                        lg: [
                            "block",
                            {
                                after: "pointer-events-none absolute bottom-0 start-1/2 z-40 h-[--toolbar-height] w-screen -translate-x-1/2 bg-gradient-to-t from-background to-transparent rtl:translate-x-1/2"
                            }
                        ]
                    }
                )}
            />
            {hasSocialLinks && (
                <>
                    <Space className={cn("hidden", { lg: "block" })} />
                    <SectionLine />
                </>
            )}
            <Divider
                className={cn(
                    "grid h-auto place-items-center px-safe-zone py-3 text-sm",
                    {
                        md: "text-xs"
                    },
                    hasSocialLinks && {
                        xs: "place-items-start"
                    }
                )}
            >
                <p
                    className={cn(
                        "flex flex-wrap justify-center gap-x-[.2em] text-center font-wght-500",
                        hasSocialLinks && {
                            xs: "justify-start text-end"
                        }
                    )}
                >
                    ©<bdi>{`2024 - ${CURRENT_YEAR}`}</bdi>
                    <bdi translate="no">{siteConfig.username}</bdi>.
                    <span>NO AI training allowed.</span>
                    <span>All Rights Reserved.</span>
                </p>
            </Divider>
            <SectionLine />
            <Space
                as="ul"
                className={cn("group flex items-center bg-transparent", {
                    hover: "text-muted-foreground/40",
                    "@[50.9375rem]": "h-fit min-h-space flex-wrap"
                })}
            >
                <Tooltip>
                    {ALL_PLATFORMS.map((platform, index, arr) => (
                        <Fragment key={platform.title}>
                            <TooltipTrigger
                                payload={{
                                    content: <span>{platform.title}</span>,
                                    sideOffset: 8
                                }}
                                render={
                                    <li
                                        className={cn("h-full flex-1", {
                                            "@[50.9375rem]":
                                                "h-space basis-[calc(20%-var(--px)*4)]",
                                            "@[19.6875rem]":
                                                "h-space basis-[calc(50%-var(--px))]"
                                        })}
                                    >
                                        <Link
                                            data-cursor="target"
                                            href={platform.links.url}
                                            externalLink
                                            openInNewTab
                                            tracking={{
                                                eventName: "click_footer_link",
                                                eventParams: {
                                                    platform: platform.title,
                                                    url: platform.links.url
                                                }
                                            }}
                                            className={cn(
                                                "grid h-full place-items-center bg-background transition-[color,background-color] duration-[.35s,.1s]",
                                                platform.title === "Behance"
                                                    ? "[&>svg]:size-7 lg:[&>svg]:size-6"
                                                    : platform.title
                                                        === "Telegram"
                                                      ? "[&>svg]:size-6.5 lg:[&>svg]:size-5.5"
                                                      : "lg:[&>svg]:size-5",
                                                {
                                                    hover: "bg-highlighted/5 text-highlighted transition-none",
                                                    active: "bg-highlighted/10 text-highlighted transition-none",
                                                    "group-hover":
                                                        "duration-[.35s,.1s]",
                                                    lg: "text-muted-foreground"
                                                }
                                            )}
                                        >
                                            <platform.icon />
                                        </Link>
                                    </li>
                                }
                            />

                            <FooterSeparator
                                index={index}
                                arr={arr}
                                containerRef={containerRef}
                            />
                        </Fragment>
                    ))}
                </Tooltip>
            </Space>
        </footer>
    )
}

function FooterSeparator({
    index,
    arr,
    containerRef
}: {
    index: number
    arr: ContactMethodDetails[]
    containerRef: React.RefObject<HTMLElement | null>
}) {
    const { isWebKit } = useBrowserEngine()

    return isWebKit ? (
        <WebkitFooterSeparator
            index={index}
            arr={arr}
            containerRef={containerRef}
        />
    ) : (
        index < arr.length - 1 && (
            <li
                role="separator"
                className={cn("z-1 h-full w-0", {
                    "@[50.9375rem]": [
                        "h-space",
                        {
                            "nth-of-type-10": "h-0 w-full",
                            "[&>*]:nth-of-type-10": "h-0 w-full",
                            "[&_hr]:nth-of-type-10":
                                "h-auto w-full border-b border-r-0"
                        }
                    ],
                    "@[19.6875rem]": {
                        // Reset
                        "nth-of-type-10": "h-space w-0",
                        "[&>*]:nth-of-type-10": "h-full w-0",
                        "[&_hr]:nth-of-type-10":
                            "h-full w-auto border-b-0 border-r",

                        "nth-of-type-[4n]": "h-0 w-full",
                        "[&>*]:nth-of-type-[4n]": "h-0 w-full",
                        "[&_hr]:nth-of-type-[4n]":
                            "h-auto w-full border-b border-r-0"
                    }
                })}
            >
                <ElementLine />
            </li>
        )
    )
}

function WebkitFooterSeparator({
    index,
    arr,
    containerRef
}: {
    index: number
    arr: ContactMethodDetails[]
    containerRef: React.RefObject<HTMLElement | null>
}) {
    const isContainerNarrow = useContainerQuery(containerRef, "50.9375rem")

    return isContainerNarrow && index === 4 ? (
        <li role="separator" className={cn("z-1 h-0 w-full")}>
            <ElementLine dir="horizontal" />
        </li>
    ) : (
        index < arr.length - 1 && (
            <li
                role="separator"
                className={cn("z-1 h-full", {
                    "@[50.9375rem]": "h-space"
                })}
            >
                <SvgElementLine />
            </li>
        )
    )
}

export default Footer
