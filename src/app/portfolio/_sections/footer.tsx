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
            <div className={cn("bg-background relative")}>
                <div className={cn("bg-highlighted/10 p-2")}>
                    <div
                        className={cn(
                            "bg-background border-highlighted flex aspect-3/1 size-full items-center justify-evenly rounded-2xl border bg-[radial-gradient(oklch(from_var(--stroke-foreground)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--stroke-foreground)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-size-[.75rem_.75rem] bg-fixed bg-position-[0_0,.375rem_.375rem]"
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
                                    My <br /> Portfolio
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
                    "bg-background grid w-full grid-cols-[1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr_var(--px)_1fr]"
                )}
            >
                {[
                    { qrSrc: "/static/qr/email.webp", label: "Email" },
                    { qrSrc: "/static/qr/zalo.webp", label: "Zalo" },
                    { qrSrc: "/static/qr/facebook.webp", label: "Facebook" }
                ].map((item, index, arr) => (
                    <React.Fragment key={item.label}>
                        <div
                            className={cn(
                                "bg-highlighted/10 relative grid aspect-square w-full place-items-center p-6"
                            )}
                        >
                            <img
                                src={item.qrSrc}
                                alt={item.label}
                                className={cn("w-full")}
                            />
                            <div
                                className={cn(
                                    "bg-background border-stroke-foreground absolute -bottom-5.75 flex rounded-md border px-1 py-0.5"
                                )}
                            >
                                <span
                                    className={cn(
                                        "text-xxs font-extrabold tracking-tight uppercase"
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
