import { ViewTransition } from "react"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold, H3, Highlight, Link, Text } from "@/components/ui/typography"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import { TOOL_ICONS } from "@/portfolio/_configs/tools"

import { type projects } from "~/.velite"

const ICON = TOOL_ICONS({ size: "sm" })

const TRAILING_REGEX = /[.!?]$/u
const MEDIA_REGEX = /\.(jpg|png|mp4|mp3)$/u

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
                        "absolute -top-9.5 left-6 font-mono uppercase"
                    )}
                >
                    {type}
                </span>
                <div className={cn("flex flex-1 flex-col gap-2 px-6 py-4.5")}>
                    <H3
                        id={headerId}
                        className={cn(
                            "w-fit text-pretty text-foreground wrap-anywhere"
                        )}
                    >
                        <ProjectName projectName={projectName} />
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
                    <ProjectCategory
                        projectName={projectName}
                        category={category}
                    />
                </div>
                <ElementLine
                    className={cn({
                        md: "-mx-6 h-auto w-screen border-b border-r-0"
                    })}
                />
                <Divider dir="vertical" className={cn("md:hidden")} />
                <ElementLine className={cn("md:hidden")} />
                <div
                    className={cn(
                        "flex flex-1 flex-col justify-between text-pretty px-6 py-4.5",
                        {
                            md: "gap-2"
                        }
                    )}
                >
                    <Highlight
                        className={cn(
                            !information.newest && "text-transparent md:hidden"
                        )}
                    >
                        {information.newest ? "Newest" : "Older"}
                    </Highlight>
                    <Text>{information.duration}</Text>
                    <Text className="text-foreground">
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
                        <Tooltip>
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
                        </Tooltip>
                    </div>
                )}
            </div>
            {detail && (
                <>
                    <SectionLine />
                    <div className={cn("flex flex-col gap-2 px-6 py-4.5")}>
                        <Bold className={cn("text-pretty")}>
                            {formatOrdinals(detail.description)}
                        </Bold>
                        {detail.abbreviation && (
                            <Text className={cn("text-pretty")}>
                                {formatOrdinals(detail.abbreviation)}
                            </Text>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

function ProjectName({ projectName }: { projectName: string }) {
    return (
        <ViewTransition
            name={formatViewTransitionName(`project-${projectName}`)}
        >
            <span>{formatOrdinals(projectName)}</span>
        </ViewTransition>
    )
}

function ProjectCategory({
    projectName,
    category
}: {
    projectName: string
    category: string
}) {
    return (
        <ViewTransition
            name={formatViewTransitionName(
                `category-${projectName}-${category}`
            )}
        >
            <Highlight className={cn("w-fit")}>{category}</Highlight>
        </ViewTransition>
    )
}

export default ProjectHeader
