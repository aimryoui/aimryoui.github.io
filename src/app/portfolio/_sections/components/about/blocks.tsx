"use client"

import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SvgElementLine } from "@/components/layout/line"
import { LinkButton } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { usePreference } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"

import { projects } from "~/.velite"

function Blocks() {
    const { motionReduced, effectTargetCursor } = usePreference()

    return (
        <section className={cn("flex bg-background")}>
            <Tooltip>
                <NumberBlocks
                    motionReduced={motionReduced}
                    effectTargetCursor={effectTargetCursor}
                />

                <BlockDivider />

                <LocationBlock motionReduced={motionReduced} />

                <BlockDivider />

                <NationBlock motionReduced={motionReduced} />
            </Tooltip>
        </section>
    )
}

const NUMBERS = [
    { value: "20+", label: "Clients Served" },
    {
        value: `${Math.floor(projects.length / 5) * 5 + 5}+`,
        label: "Shipped Projects"
    },
    {
        value: `${new Date().getFullYear() - 2022}+`,
        label: "Years as a Designer"
    }
]

function NumberBlocks({
    motionReduced,
    effectTargetCursor
}: Pick<
    ReturnType<typeof usePreference>,
    "motionReduced" | "effectTargetCursor"
>) {
    return NUMBERS.map((item, index, array) => (
        <Fragment key={item.label}>
            <div
                data-cursor="target"
                data-sound={
                    motionReduced || !effectTargetCursor ? false : "button"
                }
                className={cn(
                    "relative grid h-24 flex-1 place-items-center bg-highlighted/10",
                    {
                        md: "pb-4",
                        sm: "h-space"
                    }
                )}
            >
                <Highlight
                    className={cn("text-4xl font-wght-[625]", {
                        xl: "text-3xl",
                        md: "text-2xl"
                    })}
                >
                    <bdi>{item.value}</bdi>
                </Highlight>
                <div
                    className={cn(
                        "absolute top-full flex translate-y-[.15625rem] items-center justify-center rounded-md border border-stroke bg-background px-1",
                        {
                            md: "bottom-0 top-auto h-[calc(var(--spacing-safe-zone)+var(--px)*2)] w-full translate-y-0 rounded-none border-0 border-t border-dashed px-1.5 pb-px"
                        }
                    )}
                >
                    <span
                        className={cn(
                            "inline-block max-w-full truncate text-xxs uppercase leading-4 font-wght-[625]"
                        )}
                    >
                        {item.label}
                    </span>
                </div>
            </div>
            {index < array.length - 1 && (
                <>
                    <SvgElementLine className="h-24 sm:h-space" />
                    <Divider dir="vertical" className="h-24 sm:h-space" />
                    <SvgElementLine className="h-24 sm:h-space" />
                </>
            )}
        </Fragment>
    ))
}

function LocationBlock({
    motionReduced
}: Pick<ReturnType<typeof usePreference>, "motionReduced">) {
    return (
        <div
            className={cn(
                "relative grid h-24 flex-1 place-items-center bg-highlighted/10",
                {
                    md: "hidden",
                    sm: "h-space"
                }
            )}
        >
            <TooltipTrigger
                payload={{
                    content: "Hồ Chí Minh City"
                }}
                render={
                    <LinkButton
                        href="https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                        nativeLink
                        keepFeedback
                        data-sound={motionReduced ? false : "button"}
                        openInNewTab
                        tracking={{
                            eventName: "click_about_link",
                            eventParams: {
                                link_name: "Ho_Chi_Minh_City",
                                url: "https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                            }
                        }}
                        className={cn(
                            "grid size-full place-items-center text-4xl text-highlighted underline",
                            {
                                hover: "decoration-current decoration-solid",
                                active: "decoration-current decoration-solid",
                                "focus-visible": "text-highlighted",

                                xl: "text-3xl",
                                md: "text-2xl"
                            }
                        )}
                    >
                        <Highlight className={cn("font-wght-[625]")}>
                            <bdi>HCMC</bdi>
                        </Highlight>
                    </LinkButton>
                }
            />
            <div
                className={cn(
                    "absolute top-full flex translate-y-[.15625rem] items-center justify-center rounded-md border border-stroke bg-background px-1"
                )}
            >
                <span
                    className={cn(
                        "text-xxs uppercase leading-4 font-wght-[625]"
                    )}
                >
                    Current Location
                </span>
            </div>
        </div>
    )
}

function NationBlock({
    motionReduced
}: Pick<ReturnType<typeof usePreference>, "motionReduced">) {
    return (
        <div
            data-cursor="target"
            data-sound={motionReduced ? false : "button"}
            className={cn(
                "relative grid h-24 flex-1 place-items-center bg-highlighted/10",
                {
                    md: "hidden",
                    sm: "h-space"
                }
            )}
        >
            <TooltipTrigger
                payload={{
                    content: "Việt Nam"
                }}
                render={
                    <LinkButton
                        href="https://wikipedia.org/wiki/Vietnam"
                        nativeLink
                        openInNewTab
                        tracking={{
                            eventName: "click_about_link",
                            eventParams: {
                                link_name: "Vietnam",
                                url: "https://wikipedia.org/wiki/Vietnam"
                            }
                        }}
                        className={cn("grid size-full place-items-center")}
                    >
                        <Highlight
                            className={cn("sr-only text-4xl font-wght-[625]", {
                                md: "text-2xl"
                            })}
                        >
                            <bdi>Vietnam</bdi>
                        </Highlight>
                        {/* https://css-shape.com/star/ */}
                        <div
                            className={cn(
                                "grid aspect-3/2 w-[--w] place-items-center bg-[#da251d] [--w:calc(var(--spacing)*12)]"
                            )}
                        >
                            <div
                                className={cn(
                                    "aspect-square w-[calc(var(--w)/5*2)] bg-[#ffff00] clip-star"
                                )}
                            />
                        </div>
                    </LinkButton>
                }
            />
            <div
                className={cn(
                    "absolute top-full flex translate-y-[.15625rem] items-center justify-center rounded-md border border-stroke bg-background px-1"
                )}
            >
                <span
                    className={cn(
                        "text-xxs uppercase leading-4 font-wght-[625]"
                    )}
                >
                    Nationality
                </span>
            </div>
        </div>
    )
}

function BlockDivider() {
    return (
        <>
            <SvgElementLine
                className={cn("h-24", {
                    md: "hidden",
                    sm: "h-space"
                })}
            />
            <Divider
                dir="vertical"
                className={cn("h-24", {
                    md: "hidden",
                    sm: "h-space"
                })}
            />
            <SvgElementLine
                className={cn("h-24", {
                    md: "hidden",
                    sm: "h-space"
                })}
            />
        </>
    )
}

export { Blocks }
