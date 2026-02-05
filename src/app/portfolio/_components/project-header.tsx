"use client"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { tooltipHandle, TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold, H3, Highlight, Link, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { slugify } from "@/lib/slugify"
import { cn } from "@/lib/utils"
import { TOOL_ICONS } from "@/portfolio/_configs/tools"
import { type projects } from "~/.velite"

function ProjectHeader({
    type,
    projectName,
    category,
    information,
    tools,
    detail
}: Omit<(typeof projects)[number], "slug" | "code">) {
    const headerId = slugify(projectName)
    return (
        <div className={cn("bg-background relative")}>
            <div
                className={cn(
                    "grid grid-cols-[3fr_var(--px)_calc(var(--spacing)*6)_var(--px)_2fr]"
                )}
            >
                <span
                    className={cn(`
                        absolute -top-10.5 left-6
                        font-mono tracking-normal uppercase
                    `)}
                >
                    {type}
                </span>
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-2 px-6 pt-3.25 pb-3.75"
                    )}
                >
                    <H3 id={headerId} className={cn("text-pretty")}>
                        {formatOrdinal(
                            projectName +
                                (/[.!?]$/.test(projectName) ||
                                /\.(jpg|png|mp4|mp3)$/.test(projectName)
                                    ? ""
                                    : ".")
                        )}
                    </H3>
                    <Highlight className={cn("font-normal")}>
                        {category}
                    </Highlight>
                </div>
                <ElementLine />
                <Divider dir="vertical" />
                <ElementLine />
                <div
                    className={cn(
                        "flex flex-1 flex-col justify-between px-6 pt-3.25 pb-3.75"
                    )}
                >
                    <Highlight
                        className={cn(
                            "font-normal",
                            !information.newest && "text-transparent"
                        )}
                    >
                        {information.newest ? "Newest" : "Older"}
                    </Highlight>
                    <Text>{information.duration}</Text>
                    <Text>
                        {information.subject}{" "}
                        {information.place && (
                            <>
                                <At /> {information.place}
                            </>
                        )}
                    </Text>
                </div>
                {tools.length > 0 && (
                    <div
                        className={cn(`
                            absolute -top-10.5 right-4.5
                            flex gap-2
                        `)}
                    >
                        <Text className="sr-only">
                            {tools.map((key, index) => {
                                const tool = TOOL_ICONS()[key]
                                return (
                                    tool.label +
                                    (index === tools.length - 1 ? "." : ", ")
                                )
                            })}
                        </Text>
                        {tools.map((key) => {
                            const tool = TOOL_ICONS({ size: "sm" })[key]

                            return (
                                <TooltipTrigger
                                    key={key}
                                    handle={tooltipHandle}
                                    payload={tool.label}
                                    render={
                                        <Link openInNewTab href={tool.url}>
                                            {tool.icon}
                                        </Link>
                                    }
                                />
                            )
                        })}
                    </div>
                )}
            </div>
            {detail && (
                <>
                    <SectionLine />
                    <div
                        className={cn(
                            "flex flex-col gap-2 px-6 pt-3.25 pb-3.75"
                        )}
                    >
                        <Bold className={cn("text-pretty")}>
                            {formatOrdinal(detail.description)}
                        </Bold>
                        {detail.abbreviation && (
                            <Text className={cn("text-pretty")}>
                                {formatOrdinal(detail.abbreviation)}
                            </Text>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default ProjectHeader
