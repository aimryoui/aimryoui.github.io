import React from "react"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Highlight, Link } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { PROJECT_CATEGORIES } from "@/portfolio/_configs/project-categories"

const sections = Object.entries(PROJECT_CATEGORIES)

function Outlines() {
    return (
        <section>
            <Space />
            <SectionLine />
            <SectionTitle id="outlines" title="Outlines" note="Index" />
            <SectionLine />
            <Divider />
            <SectionLine />
            <div
                className={cn(
                    "grid grid-cols-[3fr_var(--px)_calc(var(--spacing)*6)_var(--px)_2fr] bg-background"
                )}
            >
                <div>
                    {sections.map(([key, section], index, arr) => (
                        <React.Fragment key={key}>
                            <div
                                className={cn(
                                    "grid grid-cols-3 gap-6 gap-y-3 pb-3.75 pt-3.25"
                                )}
                            >
                                <Highlight className={cn("ps-6 font-normal")}>
                                    {String(index + 1).padStart(2, "0")}
                                </Highlight>
                                <Link
                                    href={`#${key}`}
                                    className={cn(
                                        "group col-span-2 flex items-center gap-2 pe-6"
                                    )}
                                >
                                    {section.title}
                                    <div
                                        className={cn(
                                            "hidden size-5 translate-y-[.0625rem] place-items-center rounded-full bg-highlighted/10 text-highlighted",
                                            "group-hover:grid dark:bg-highlighted/20"
                                        )}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className={cn("size-3")}
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M12.002 1c.741 0 1.263.521 1.263 1.286v14.389l-.093 2.502 3.058-3.418 2.63-2.595c.22-.22.545-.37.892-.37.695 0 1.217.532 1.217 1.24 0 .335-.128.636-.394.914l-7.635 7.646c-.255.255-.59.406-.938.406s-.684-.15-.939-.405L3.43 14.947c-.266-.278-.394-.579-.394-.915 0-.707.51-1.24 1.205-1.24.36 0 .672.151.904.371l2.63 2.595 3.058 3.406-.093-2.49V2.285c0-.764.51-1.285 1.263-1.285Z"
                                            />
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                            {index < arr.length - 1 && (
                                <SectionLine className={cn("right-0")} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <ElementLine />
                <Divider dir="vertical" />
                <ElementLine />
                <div className={cn("bg-highlighted/10 p-2")}>
                    <div
                        className={cn(
                            "grid size-full place-items-center rounded-2xl border border-highlighted bg-background px-14",
                            "bg-[radial-gradient(oklch(from_var(--stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-position-[0_0,.375rem_.375rem] bg-size-[.75rem_.75rem]"
                        )}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 600 600"
                            className={cn("w-full")}
                            shapeRendering="optimizeSpeed"
                        >
                            <path
                                className={cn(
                                    "fill-background stroke-highlighted stroke-[0.09375rem]"
                                )}
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M203.685 350.406v219.222l-63.663-36.758V386.722l-127.39-73.516v-73.073l191.053 110.273ZM458.404 351.359v73.073l-128.4-74.084-58.547-33.789-4.105-2.4V94.938l63.663 36.757v146.148l127.389 73.516Z"
                            />
                            <path
                                className={cn(
                                    "fill-highlighted/10 stroke-highlighted stroke-[0.09375rem]"
                                )}
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m271.454 316.556-9.284 4.61-58.485 29.242L12.633 240.134l126.316-63.157 128.4 74.084v63.095l4.105 2.4Z"
                            />
                            <path
                                className={cn(
                                    "fill-background stroke-highlighted stroke-[0.09375rem]"
                                )}
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m457.331 68.54-126.316 63.157-63.663-36.758L393.667 31.78l63.664 36.758Z"
                            />
                            <path
                                className={cn(
                                    "fill-highlighted/10 stroke-highlighted stroke-[0.09375rem]"
                                )}
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M457.331 68.54v146.147l-63.663 31.768-62.652 31.263V131.697l126.315-63.158ZM584.721 288.203l-126.316 63.158-127.389-73.516v-.126l62.652-31.263 63.663-31.768 127.39 73.515Z"
                            />
                            <path
                                className={cn(
                                    "fill-background stroke-highlighted stroke-[0.09375rem]"
                                )}
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M584.714 288.203v73.074l-126.316 63.158v-73.074l126.316-63.158Z"
                            />
                            <path
                                className={cn(
                                    "fill-highlighted/10 stroke-highlighted stroke-[0.09375rem]"
                                )}
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M330.003 350.344V506.47l-126.315 63.158V350.407l58.484-29.242 9.284-4.61 58.547 33.789Z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Outlines
