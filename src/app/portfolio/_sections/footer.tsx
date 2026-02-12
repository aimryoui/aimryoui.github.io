import React from "react"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { SectionName } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function Footer() {
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
                sectionName="Adopt Me"
                containerClassName="bg-background"
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
                    <React.Fragment key={item.label}>
                        <div
                            className={cn(
                                "relative grid aspect-square w-full place-items-center bg-highlighted/10 p-6"
                            )}
                        >
                            <img
                                src={item.qrSrc}
                                alt={item.label}
                                decoding="async"
                                className={cn("w-full")}
                            />
                            <div
                                className={cn(
                                    "absolute -bottom-5.75 flex rounded-md border border-stroke bg-background px-1 py-0.5"
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
                    </React.Fragment>
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
