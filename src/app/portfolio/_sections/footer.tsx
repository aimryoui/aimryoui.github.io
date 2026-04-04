"use client"

import { Fragment } from "react"
import NextLink from "next/link"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { SectionName } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { sections } from "@/portfolio/_sections/contact"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

function Footer() {
    const mode = usePortfolioModeStore((state) => state.mode)

    if (mode === "pages") {
        return (
            <footer className={cn("relative bg-background")}>
                <SectionLine />
                <Divider
                    className={cn(
                        "grid h-auto place-items-center bg-background px-4 py-3 text-sm"
                    )}
                >
                    <p className="text-balance text-center">
                        {`© ${new Date().getFullYear()} hoangnhan2ka3. NO AI training allowed. All Rights Reserved.`}
                    </p>
                </Divider>
                <SectionLine />
                <Space
                    className={cn("flex items-center bg-transparent", {
                        lg: "flex-wrap",
                        md: "min-h-16"
                    })}
                >
                    {sections
                        .flatMap((section) => section.platforms)
                        .map((platform, index, arr) => (
                            <Fragment key={platform.title}>
                                <NextLink
                                    href={platform.links.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        "grid h-full flex-1 place-items-center bg-background opacity-40 will-change-[color,background-color,opacity] transition-[color,background-color,opacity] duration-100",
                                        {
                                            hover: "bg-element-hover text-highlighted opacity-100 transition-none",
                                            lg: "basis-[calc(20%-var(--px)*4)] opacity-100"
                                        }
                                    )}
                                >
                                    {platform.icon}
                                    <span className="sr-only">
                                        {platform.title}
                                    </span>
                                </NextLink>
                                {index < arr.length - 1 && (
                                    <ElementLine
                                        className={cn({
                                            "lg:nth-of-type-5":
                                                "h-auto w-full border-b border-r-0"
                                        })}
                                    />
                                )}
                            </Fragment>
                        ))}
                </Space>
            </footer>
        )
    }

    return (
        <footer>
            <Space className={cn("grid place-items-center")}>
                <Highlight
                    id="footer"
                    className={cn("text-4xl font-extrabold")}
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
                            "bg-[radial-gradient(oklch(from_var(--stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-position-[0_0,.375rem_.375rem] bg-size-[.75rem_.75rem]"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 grid grid-cols-[1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr]"
                            )}
                        >
                            <Highlight
                                className={cn(
                                    "col-span-full col-start-5 self-center text-4xl font-extrabold uppercase"
                                )}
                            >
                                Thanks <br /> for scrolling
                                <br />
                                <span className={cn("font-mono font-normal")}>
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
                {[
                    { qrSrc: "/qr/email.webp", label: "Email" },
                    { qrSrc: "/qr/zalo.webp", label: "Zalo" },
                    { qrSrc: "/qr/facebook.webp", label: "Facebook" }
                ].map((item, index, arr) => (
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
                                        "text-xxs font-extrabold uppercase tracking-tight"
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

export default Footer
