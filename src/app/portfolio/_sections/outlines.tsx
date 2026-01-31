import React from "react"

import SectionTitle from "@/app/portfolio/_components/section-title"
import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Bold, Highlight } from "@/components/ui/typography"
import { PROJECT_CATEGORIES } from "@/configs/project-categories"
import { cn } from "@/lib/utils"

const sections = Object.values(PROJECT_CATEGORIES)

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
                    "bg-background grid grid-cols-[3fr_var(--px)_calc(var(--spacing)*6)_var(--px)_2fr]"
                )}
            >
                <div>
                    {sections.map((section, index, arr) => (
                        <React.Fragment key={index}>
                            <div
                                className={cn(
                                    "grid grid-cols-3 gap-6 gap-y-3 pt-3.25 pb-3.75"
                                )}
                            >
                                <Highlight className={cn("ps-6 font-normal")}>
                                    {String(index + 1).padStart(2, "0")}
                                </Highlight>
                                <Bold className={cn("col-span-2 pe-6")}>
                                    {section.title}
                                </Bold>
                            </div>
                            {index < arr.length - 1 && <SectionLine />}
                        </React.Fragment>
                    ))}
                </div>
                <ElementLine />
                <Divider dir="vertical" />
                <ElementLine />
                <div className={cn("bg-highlighted/10 p-2")}>
                    <div
                        className={cn(
                            "bg-background border-highlighted grid size-full place-items-center rounded-2xl border bg-[radial-gradient(oklch(from_var(--stroke-foreground)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--stroke-foreground)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-size-[.75rem_.75rem] bg-fixed bg-position-[0_0,.375rem_.375rem] px-14"
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
