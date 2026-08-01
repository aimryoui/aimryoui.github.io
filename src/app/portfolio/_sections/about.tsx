import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, H1, Highlight, Link, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function About() {
    return (
        <>
            <div
                className={cn(
                    "relative bg-background px-safe-zone pb-[.96875rem] pt-3.75",
                    {
                        lg: "py-safe-zone-vertical"
                    }
                )}
            >
                <span
                    className={cn(
                        "absolute bottom-[calc(100%+1rem)] left-safe-zone font-mono uppercase leading-normal",
                        {
                            md: "bottom-[calc(100%+.75rem)] text-sm"
                        }
                    )}
                >
                    About
                </span>
                <H1
                    id="about"
                    className="flex flex-wrap gap-x-[.2em] sm:text-2xl"
                >
                    Hello there!{" "}
                    <span className="block">
                        I&#39;m{" "}
                        <Bold className="font-wght-[625] md:text-3xl sm:text-2xl">
                            Hoàng Nhân
                        </Bold>
                        ,
                    </span>{" "}
                    <span className="flex flex-wrap gap-x-[.2em]">
                        <span className="block">
                            a{" "}
                            <Bold className="font-wght-[625] md:text-3xl sm:text-2xl">
                                Creative Designer
                            </Bold>
                        </span>{" "}
                        majoring in{" "}
                        <span className="block">
                            <Highlight className="font-wght-[625] md:text-3xl sm:text-2xl">
                                UI & UX Design
                            </Highlight>
                            .
                        </span>
                    </span>
                </H1>
            </div>
            <SectionLine />
            <Divider />
            <SectionLine />
            <div
                className={cn(
                    "relative space-y-2 bg-background px-safe-zone py-safe-zone-vertical"
                )}
            >
                <Text className={cn("text-pretty")}>
                    However, I came up from{" "}
                    {[
                        "event projects",
                        "short films",
                        "social posts",
                        "publications"
                    ].map((item, index, arr) => (
                        <Fragment key={item}>
                            <Bold>{item}</Bold>
                            {index < arr.length - 1 && ", "}
                        </Fragment>
                    ))}
                    , or event-type university course projects.
                </Text>
                <Text className={cn("text-pretty")}>
                    Also, I love coding, I have some experience with{" "}
                    {[
                        "HTML5",
                        "CSS3",
                        "JavaScript",
                        "TypeScript",
                        "React",
                        "Next.js",
                        "Tailwind CSS",
                        "shadcn/ui",
                        "Tauri"
                    ].map((item, index, arr) => (
                        <Fragment key={item}>
                            <Bold>{item}</Bold>
                            {index < arr.length - 1 && ", "}
                        </Fragment>
                    ))}
                    , etc.
                </Text>
                <Text className={cn("text-pretty")}>
                    So with UI & UX Design, I can understand{" "}
                    <Highlight>what can be done, and what cannot</Highlight>.
                </Text>
                <Text className={cn("text-pretty")}>
                    From there I can{" "}
                    <Bold>
                        easily work and communicate with related positions
                    </Bold>{" "}
                    such as developers.
                </Text>
            </div>
            <SectionLine />
            <Divider />
            <SectionLine />
            <div className={cn("flex bg-background")}>
                <Tooltip>
                    {[
                        { value: "2003", label: "Year of birth" },
                        { value: "50+", label: "Projects" },
                        { value: "4+", label: "Years as Designer" }
                    ].map((item, index, array) => (
                        <Fragment key={item.label}>
                            <div
                                data-cursor="target"
                                data-sound="button"
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
                                    <span
                                        {...(item.value === "2003" && {
                                            className: "xs:hidden"
                                        })}
                                    >
                                        {item.value}
                                    </span>
                                    {item.value === "2003" && (
                                        <span className="hidden xs:inline">
                                            2K3
                                        </span>
                                    )}
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
                                            "max-w-full truncate text-xxs uppercase leading-4 font-wght-[625]"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                            {index < array.length - 1 && (
                                <>
                                    <SvgElementLine className="h-24 sm:h-space" />
                                    <Divider
                                        dir="vertical"
                                        className="h-24 sm:h-space"
                                    />
                                    <SvgElementLine className="h-24 sm:h-space" />
                                </>
                            )}
                        </Fragment>
                    ))}
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
                    <div
                        data-cursor="target"
                        data-sound="button"
                        className={cn(
                            "relative grid h-24 flex-1 place-items-center bg-highlighted/10",
                            {
                                md: "hidden",
                                sm: "h-space"
                            }
                        )}
                    >
                        <TooltipTrigger
                            payload="Hồ Chí Minh City"
                            render={
                                <Link
                                    href="https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                                    openInNewTab
                                    highlight
                                    className={cn("text-4xl", {
                                        xl: "text-3xl",
                                        md: "text-2xl"
                                    })}
                                >
                                    <Highlight
                                        className={cn("font-wght-[625]")}
                                    >
                                        HCMC
                                    </Highlight>
                                </Link>
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
                                Location
                            </span>
                        </div>
                    </div>
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
                    <div
                        data-cursor="target"
                        data-sound="button"
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
                                content: "Việt Nam",
                                sideOffset: 19
                            }}
                            render={
                                <Link
                                    href="https://wikipedia.org/wiki/Vietnam"
                                    openInNewTab
                                    className={cn(
                                        "grid aspect-3/2 w-[--w] place-items-center bg-[#da251d] [--w:calc(var(--spacing)*12)]"
                                    )}
                                >
                                    <Highlight
                                        className={cn(
                                            "sr-only text-4xl font-wght-[625]",
                                            {
                                                md: "text-2xl"
                                            }
                                        )}
                                    >
                                        Vietnam
                                    </Highlight>
                                    {/* https://css-shape.com/star/ */}
                                    <div
                                        className={cn(
                                            "aspect-square w-[calc(var(--w)/5*2)] bg-[#ffff00] clip-star"
                                        )}
                                    />
                                </Link>
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
                                Native Land
                            </span>
                        </div>
                    </div>
                </Tooltip>
            </div>
            <SectionLine />
            <Divider />
            <SectionLine />
            <Space
                className={cn(
                    "hidden h-auto min-h-space flex-col gap-0.5 px-safe-zone py-safe-zone-vertical",
                    {
                        lg: "py-safe-zone-vertical",
                        md: "flex",
                        sm: "gap-2"
                    }
                )}
            >
                <Text>
                    Currently I&#39;m living in{" "}
                    <Link
                        href="https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                        openInNewTab
                        className="inline font-wght-600"
                    >
                        Hồ Chí Minh City
                    </Link>
                    , based in{" "}
                    <Link
                        href="https://wikipedia.org/wiki/Vietnam"
                        openInNewTab
                        className="inline-flex items-center gap-1 font-wght-600"
                    >
                        <span
                            className={cn(
                                "grid aspect-3/2 h-fit w-[--w] translate-y-[.05em] place-items-center bg-[#da251d] [--w:calc(var(--spacing)*6)]"
                            )}
                        >
                            <span
                                className={cn(
                                    "aspect-square w-[calc(var(--w)/5*2)] bg-[#ffff00] clip-star"
                                )}
                            />
                        </span>
                        Việt Nam
                    </Link>
                    .
                </Text>
                <Text>
                    I&#39;m <Bold>comfortable</Bold> with remote setups,
                    experienced in and <Bold>prefer working remotely</Bold>.
                </Text>
            </Space>
        </>
    )
}

export default About
