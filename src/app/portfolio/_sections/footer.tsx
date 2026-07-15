"use client"

import { Fragment } from "react"
import NextLink from "next/link"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { SectionName } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { sections } from "@/portfolio/_sections/contact"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

const ALL_PLATFORMS = sections.flatMap((section) => section.platforms)

const QR_ITEMS = [
    { qrSrc: "/qr/email.webp", label: "Email" },
    { qrSrc: "/qr/zalo.webp", label: "Zalo" },
    { qrSrc: "/qr/facebook.webp", label: "Facebook" }
]

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
    const mode = usePortfolioModeStore((state) => state.mode)

    if (mode === "spread") {
        return (
            <footer>
                <Space className={cn("grid place-items-center")}>
                    <Highlight
                        id="footer"
                        className={cn("text-4xl font-wght-800")}
                    >
                        The end.
                    </Highlight>
                </Space>
                <SectionLine showDecoration />
                <Space />
                <SectionLine />
                <div className={cn("relative bg-background")}>
                    <div className={cn("bg-highlighted/10 p-2")}>
                        <div
                            className={cn(
                                "flex aspect-3 size-full items-center justify-evenly rounded-2xl border border-highlighted bg-background",
                                "bg-[radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-[length:.75rem_.75rem] bg-[position:0_0,.375rem_.375rem]"
                            )}
                        >
                            <div
                                className={cn(
                                    "absolute inset-0 grid grid-cols-[1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr]"
                                )}
                            >
                                <Highlight
                                    className={cn(
                                        "col-span-full col-start-5 self-center text-4xl uppercase font-wght-800"
                                    )}
                                >
                                    Thanks <br /> for scrolling
                                    <br />
                                    <span className={cn("font-mono")}>
                                        My <br /> Portfolio.
                                    </span>
                                </Highlight>
                            </div>
                        </div>
                    </div>
                </div>
                <SectionLine />
                <SectionName
                    id="adopt-me"
                    sectionName="Adopt Me"
                    containerClassName="static z-1 bg-background"
                />
                <SectionLine />
                <div
                    className={cn(
                        "grid w-full grid-cols-[1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr] bg-background"
                    )}
                >
                    {QR_ITEMS.map((item, index, arr) => (
                        <Fragment key={item.label}>
                            <div
                                className={cn(
                                    "relative grid aspect-square w-full place-items-center bg-highlighted/10 p-6"
                                )}
                            >
                                <img
                                    src={item.qrSrc}
                                    alt={item.label}
                                    className={cn("w-full")}
                                    decoding="async"
                                    loading="lazy"
                                />
                                <div
                                    className={cn(
                                        "absolute -bottom-5.25 flex rounded-md border border-stroke bg-background px-1 py-0.5"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-xxs uppercase tracking-tight font-wght-800"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                            {index < arr.length - 1 && (
                                <>
                                    <ElementLine />
                                    <Divider
                                        dir="vertical"
                                        className={cn("w-full")}
                                    />
                                    <ElementLine />
                                </>
                            )}
                        </Fragment>
                    ))}
                </div>
                <SectionLine />
                <Divider />
                <SectionLine />
                <Space />
                <SectionLine showDecoration />
                <Space />
            </footer>
        )
    }

    return (
        <footer
            className={cn("relative flex flex-col bg-background", {
                md: "flex-col-reverse"
            })}
        >
            <Space className={cn("hidden", { lg: "block" })} />
            <Divider
                className={cn(
                    "grid h-auto place-items-center bg-background px-4 py-3 text-sm"
                )}
            >
                <p className="flex flex-wrap justify-center gap-x-0.5 text-balance text-center">
                    {`© ${CURRENT_YEAR} aimryoui. NO AI training allowed.`}
                    <span>All Rights Reserved.</span>
                </p>
            </Divider>
            <SectionLine />
            <Space
                as="ul"
                className={cn("flex items-center bg-transparent", {
                    xl: "h-fit min-h-20 flex-wrap"
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
                                            xl: "h-20 basis-[calc(20%-var(--px)*4)]"
                                        })}
                                    >
                                        <NextLink
                                            href={platform.links.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            data-cursor="target"
                                            className={cn(
                                                "grid h-full place-items-center bg-background opacity-40 will-change-[color,background-color,opacity] transition-[color,background-color,opacity] duration-100",
                                                {
                                                    hover: "bg-highlighted/5 text-highlighted opacity-100 transition-none",
                                                    active: "bg-highlighted/10 text-highlighted opacity-100 transition-none",
                                                    lg: "opacity-100"
                                                }
                                            )}
                                        >
                                            {platform.icon}
                                            <span className="sr-only">
                                                {platform.title}
                                            </span>
                                        </NextLink>
                                    </li>
                                }
                            />

                            {index < arr.length - 1 && (
                                <li
                                    role="separator"
                                    className={cn("h-full", {
                                        xl: [
                                            "h-20",
                                            {
                                                "nth-of-type-10":
                                                    "h-auto w-full",
                                                "[&>hr]:nth-of-type-10":
                                                    "h-auto w-full border-b border-r-0"
                                            }
                                        ]
                                    })}
                                >
                                    <ElementLine />
                                </li>
                            )}
                        </Fragment>
                    ))}
                </Tooltip>
            </Space>
        </footer>
    )
}

export default Footer
