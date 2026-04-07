import { ViewTransition } from "react"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold, H3, Highlight, Link, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import { TOOL_ICONS } from "@/portfolio/_configs/tools"

import { type projects } from "~/.velite"

const ICON = TOOL_ICONS({ size: "sm" })

const TRAILING_REGEX = /[.!?]$/
const MEDIA_REGEX = /\.(jpg|png|mp4|mp3)$/

function ProjectHeader({
    type,
    projectName,
    category,
    information,
    tools,
    detail
}: Omit<(typeof projects)[number], "forceExpand" | "slug" | "code">) {
    const headerId = slugify(projectName)

    return (
        <div className={cn("relative bg-background")}>
            <div
                className={cn(
                    "grid grid-cols-[minmax(0,3fr)_var(--px)_calc(var(--spacing)*6)_var(--px)_minmax(0,2fr)]",
                    {
                        md: "grid-cols-1"
                    }
                )}
            >
                <span
                    className={cn(
                        "absolute -top-10 left-6 font-mono uppercase tracking-normal"
                    )}
                >
                    {type}
                </span>
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-2 px-6 pb-3.75 pt-3.25"
                    )}
                >
                    <H3
                        id={headerId}
                        className={cn("w-fit text-pretty text-foreground")}
                    >
                        <ViewTransition
                            name={formatViewTransitionName(
                                `project-${projectName}`
                            )}
                        >
                            <span>{formatOrdinal(projectName)}</span>
                        </ViewTransition>
                        {!(
                            TRAILING_REGEX.test(projectName) ||
                            MEDIA_REGEX.test(projectName)
                        ) && (
                            <span
                                style={{
                                    viewTransitionName: "project-name-dot"
                                }}
                            >
                                .
                            </span>
                        )}
                    </H3>
                    <ViewTransition
                        name={formatViewTransitionName(
                            `category-${projectName}-${category}`
                        )}
                    >
                        <Highlight className={cn("w-fit font-normal")}>
                            {category}
                        </Highlight>
                    </ViewTransition>
                </div>
                <ElementLine
                    className={cn({
                        md: "h-auto w-full border-b border-r-0"
                    })}
                />
                <Divider dir="vertical" className={cn("md:hidden")} />
                <ElementLine className={cn("md:hidden")} />
                <div
                    className={cn(
                        "flex flex-1 flex-col justify-between text-pretty px-6 pb-3.75 pt-3.25 md:text-sm"
                    )}
                >
                    <Highlight
                        className={cn(
                            "font-normal",
                            !information.newest && "text-transparent md:hidden"
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
                        className={cn("absolute -top-10 right-4.5 flex gap-2")}
                    >
                        {tools.map((key) => {
                            const tool = ICON[key]

                            return (
                                <TooltipTrigger
                                    key={key}
                                    payload={tool.label}
                                    render={
                                        <Link openInNewTab href={tool.url}>
                                            {tool.icon}
                                            <span className="sr-only">
                                                {tool.label}
                                            </span>
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
                            "flex flex-col gap-2 px-6 pb-3.75 pt-3.25"
                        )}
                    >
                        <Bold className={cn("text-pretty")}>
                            {formatOrdinal(detail.description)}
                        </Bold>
                        {detail.abbreviation && (
                            <Text className={cn("text-pretty md:text-sm")}>
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
