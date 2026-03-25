import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold, H3, Highlight, Link, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
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
                    "grid grid-cols-[minmax(0,3fr)_var(--px)_calc(var(--spacing)*6)_var(--px)_minmax(0,2fr)]"
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
                        className={cn("text-pretty text-foreground")}
                    >
                        {formatOrdinal(
                            projectName +
                                (TRAILING_REGEX.test(projectName) ||
                                MEDIA_REGEX.test(projectName)
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
                        "flex flex-1 flex-col justify-between px-6 pb-3.75 pt-3.25"
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
