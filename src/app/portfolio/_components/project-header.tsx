"use client"

import { ViewTransition } from "@/components/animations/view-transition"
import { Divider } from "@/components/layout/divider"
import {
    ElementLine,
    SectionLine,
    SvgElementLine
} from "@/components/layout/line"
import { useDirection } from "@/components/ui/direction"
import { Link } from "@/components/ui/link"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { At, H1, Highlight, Text } from "@/components/ui/typography"
import {
    RTL_CHAR_REGEX,
    TRAILING_MEDIA_FILE_EXTENSIONS_REGEX,
    TRAILING_PUNCTUATION_REGEX
} from "@/helpers/character-regexes"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"
import { TOOL_ICONS } from "@/portfolio/_configs/tools"
import { type ProjectId } from "@/types/project-ids"

import { type projects } from "~/.velite"

const ICON = TOOL_ICONS({ size: "sm" })

function ProjectHeader({
    type,
    projectId,
    projectName,
    category,
    features,
    information,
    tools,
    detail
}: Omit<
    (typeof projects)[number],
    "id" | "name" | "forceExpand" | "slug" | "code" | "filePath"
> & {
    projectId?: ProjectId
    projectName: (typeof projects)[number]["name"]
}) {
    const { subject, duration, place } = information
    const isNew = features?.new ?? false

    const direction = useDirection()

    const isRTLText = RTL_CHAR_REGEX.test(projectName)
    const hasTrailingPunctuation = TRAILING_PUNCTUATION_REGEX.test(projectName)

    const isClashing =
        hasTrailingPunctuation
        && ((direction === "rtl" && isRTLText)
            || (direction === "ltr" && !isRTLText))

    const shouldHideDot =
        isClashing || TRAILING_MEDIA_FILE_EXTENSIONS_REGEX.test(projectName)

    return (
        <div className={cn("relative bg-background")}>
            <div
                className={cn(
                    "grid grid-cols-[minmax(0,3fr)_var(--px)_var(--spacing-safe-zone)_var(--px)_minmax(0,2fr)]",
                    {
                        md: "grid-cols-1"
                    }
                )}
            >
                <span
                    className={cn(
                        "absolute bottom-[calc(100%+1rem)] start-safe-zone line-clamp-2 font-mono uppercase leading-normal wrap-anywhere",
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
                        className={cn(
                            "w-fit text-pretty text-foreground wrap-anywhere"
                        )}
                    >
                        <ProjectName
                            projectId={projectId}
                            projectName={projectName}
                        />
                        {!shouldHideDot && (
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
                            "absolute bottom-[calc(100%+1.05rem)] end-safe-zone flex gap-2",
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
                                            <Link href={tool.url} openInNewTab>
                                                {tool.icon}
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
    projectName
}: {
    projectId?: ProjectId
    projectName: string
}) {
    return (
        <ViewTransition name={`project-${projectId}`}>
            <bdi translate="no">{formatOrdinals(projectName)}</bdi>
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
