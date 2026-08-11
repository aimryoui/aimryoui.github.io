import { ViewTransition } from "react"

import { Divider } from "@/components/layout/divider"
import {
    ElementLine,
    SectionLine,
    SvgElementLine
} from "@/components/layout/line"
import { LinkButton } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { At, H1, Highlight, Text } from "@/components/ui/typography"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import { TOOL_ICONS } from "@/portfolio/_configs/tools"
import { type ProjectId } from "@/types/project-ids"

import { type projects } from "~/.velite"

const ICON = TOOL_ICONS({ size: "sm" })

const TRAILING_REGEX = /[.!?]$/u
const MEDIA_REGEX = /\.(jpg|png|mp4|mp3)$/u

function ProjectHeader({
    type,
    projectId,
    projectName,
    category,
    features,
    information,
    tools,
    detail,
    isSelectedWorks = false
}: Omit<
    (typeof projects)[number],
    "id" | "name" | "forceExpand" | "slug" | "code" | "filePath"
> & {
    projectId: ProjectId
    projectName: (typeof projects)[number]["name"]
    isSelectedWorks?: boolean
}) {
    const headerId = slugify(projectName)
    const { subject, duration, place } = information
    const isNew = features?.new ?? false

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
                        "absolute bottom-[calc(100%+1rem)] left-safe-zone line-clamp-2 font-mono uppercase leading-normal wrap-anywhere",
                        {
                            md: "bottom-[calc(100%+.75rem)] text-sm"
                        }
                    )}
                    style={{
                        maxWidth: `calc(100% - var(--spacing-safe-zone) * 2 - var(--spacing) * 2 * ${tools.length} - var(--spacing) * 6 * ${tools.length})`
                    }}
                >
                    {type}
                </span>
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-2 px-safe-zone py-safe-zone-vertical",
                        {
                            md: "gap-1.5"
                        }
                    )}
                >
                    <H1
                        id={headerId}
                        className={cn(
                            "w-fit text-pretty text-foreground wrap-anywhere"
                        )}
                    >
                        <ProjectName
                            projectId={projectId}
                            projectName={projectName}
                            isSelectedWorks={isSelectedWorks}
                        />
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
                    </H1>
                    <ProjectCategory
                        projectName={projectName}
                        category={category}
                        isSelectedWorks={isSelectedWorks}
                    />
                </div>
                <SvgElementLine className={cn("md:hidden")} />
                <ElementLine
                    dir="horizontal"
                    className={cn("w-screen")}
                    containerClassName={cn("hidden", {
                        md: "block"
                    })}
                />
                <Divider dir="vertical" className={cn("md:hidden")} />
                <SvgElementLine className={cn("md:hidden")} />
                <div
                    className={cn(
                        "flex flex-1 flex-col justify-between text-pretty px-safe-zone py-safe-zone-vertical",
                        {
                            md: "gap-2"
                        }
                    )}
                >
                    <Highlight
                        className={cn(!isNew && "text-transparent md:hidden")}
                    >
                        {isNew ? "New" : "Older"}
                    </Highlight>
                    <Text>{duration}</Text>
                    <Text className="text-foreground">
                        {subject}{" "}
                        {place && (
                            <>
                                <At /> {place}
                            </>
                        )}
                    </Text>
                </div>
                {tools.length > 0 && (
                    <div
                        className={cn(
                            "absolute bottom-[calc(100%+1.05rem)] right-safe-zone flex gap-2",
                            {
                                md: "bottom-[calc(100%+.85rem)]"
                            }
                        )}
                    >
                        <Tooltip>
                            {tools.map((key) => {
                                const tool = ICON[key]

                                return (
                                    <TooltipTrigger
                                        key={key}
                                        payload={tool.label}
                                        render={
                                            <LinkButton
                                                href={tool.url}
                                                openInNewTab
                                                nativeLink
                                                keepFeedback
                                                hoverSound="tick"
                                                pressSound="link"
                                            >
                                                {tool.icon}
                                            </LinkButton>
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
                    <div
                        className={cn(
                            "flex flex-col gap-2 px-safe-zone py-safe-zone-vertical"
                        )}
                    >
                        <h2
                            className={cn(
                                "text-pretty text-foreground font-wght-600",
                                {
                                    md: "text-sm"
                                }
                            )}
                        >
                            {formatOrdinals(detail.description)}
                        </h2>
                        {detail.abbreviation && (
                            <h3
                                className={cn(
                                    "text-pretty text-muted-foreground",
                                    {
                                        md: "text-sm"
                                    }
                                )}
                            >
                                {formatOrdinals(detail.abbreviation)}
                            </h3>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

function ProjectName({
    projectId,
    projectName,
    isSelectedWorks = false
}: {
    projectId: ProjectId
    projectName: string
    isSelectedWorks?: boolean
}) {
    return (
        <ViewTransition
            name={`project-${projectId}${isSelectedWorks ? "-selected" : ""}`}
        >
            <span>{formatOrdinals(projectName)}</span>
        </ViewTransition>
    )
}

function ProjectCategory({
    projectName,
    category,
    isSelectedWorks = false
}: {
    projectName: string
    category: string
    isSelectedWorks?: boolean
}) {
    return (
        <ViewTransition
            name={formatViewTransitionName(
                `category-${projectName}-${category}${isSelectedWorks ? "-selected" : ""}`
            )}
        >
            <Highlight className={cn("w-fit")}>{category}</Highlight>
        </ViewTransition>
    )
}

export default ProjectHeader
