"use client"

import { ViewTransition } from "@/components/animations/view-transition"
import {
    ElementLine,
    SectionLine,
    SvgElementLine
} from "@/components/layout/line"
import { useDirection } from "@/components/ui/direction"
import { Link } from "@/components/ui/link"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold, H1, Highlight, Text } from "@/components/ui/typography"
import {
    DASHES_REGEX,
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
import { siteConfig } from "~/src/configs/site.config"

const ICON = TOOL_ICONS({ size: "sm" })

function ProjectHeader({ project }: { project: (typeof projects)[number] }) {
    const {
        type,
        id: projectId,
        name: projectName,
        category,
        information,
        tools,
        detail
    } = project
    const { role, subject, duration, team, place } = information

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
            <div>
                <span
                    className={cn(
                        "absolute bottom-[calc(100%+1rem)] start-safe-zone line-clamp-2 font-mono text-sm uppercase leading-normal wrap-anywhere",
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
                        "flex w-full flex-col gap-2 px-safe-zone py-safe-zone-vertical",
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
                <ElementLine dir="horizontal" className={cn("w-screen")} />
                <div className="flex sm:flex-col">
                    <div
                        className={cn(
                            "flex w-full basis-2/5 flex-col gap-2 text-pretty px-safe-zone py-safe-zone-vertical"
                        )}
                    >
                        <Text mono className="text-sm uppercase">
                            My Role
                        </Text>
                        {role ? (
                            typeof role === "string" ? (
                                <Bold className="text-foreground">{role}</Bold>
                            ) : (
                                <>
                                    {role.map((name) => (
                                        <Bold
                                            key={name}
                                            className="text-foreground"
                                        >
                                            {name}
                                        </Bold>
                                    ))}
                                </>
                            )
                        ) : (
                            <Bold className="text-foreground">Designer</Bold>
                        )}
                    </div>
                    <SvgElementLine className="sm:hidden" />
                    <SectionLine
                        dir="horizontal"
                        containerClassName="hidden sm:block"
                    />
                    <div
                        className={cn(
                            "flex w-full flex-col gap-2 text-pretty px-safe-zone py-safe-zone-vertical"
                        )}
                    >
                        <Text mono className="text-sm uppercase">
                            Team
                        </Text>
                        {team ? (
                            typeof team === "string" ? (
                                <Bold className="text-foreground">{team}</Bold>
                            ) : (
                                <>
                                    {team.map((name) => (
                                        <Bold
                                            key={name}
                                            className="text-foreground"
                                        >
                                            {name}
                                            {name === siteConfig.name && (
                                                <span className="text-muted-foreground font-wght-450 dark:font-wght-400">
                                                    {" "}
                                                    (Me)
                                                </span>
                                            )}
                                        </Bold>
                                    ))}
                                </>
                            )
                        ) : (
                            <Bold className="text-foreground">
                                Nguyễn Hoàng Nhân
                            </Bold>
                        )}
                    </div>
                </div>
                <ElementLine dir="horizontal" className={cn("w-screen")} />
                <div className="flex sm:flex-col">
                    <div
                        className={cn(
                            "flex w-full basis-2/5 flex-col gap-2 text-pretty px-safe-zone py-safe-zone-vertical"
                        )}
                    >
                        <Text mono className="text-sm uppercase">
                            Timeline
                        </Text>
                        <Bold className="text-foreground">
                            {renderDuration(duration)}
                        </Bold>
                    </div>
                    <SvgElementLine className="sm:hidden" />
                    <SectionLine center containerClassName="hidden sm:block" />
                    <div
                        className={cn(
                            "flex w-full flex-col gap-2 text-pretty px-safe-zone py-safe-zone-vertical"
                        )}
                    >
                        <Text mono className="text-sm uppercase">
                            Organization
                        </Text>
                        <Bold className="text-foreground">
                            {subject}{" "}
                            {place && (
                                <>
                                    <At /> {place}
                                </>
                            )}
                        </Bold>
                    </div>
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
                    <SectionLine center />
                    <div
                        className={cn(
                            "flex flex-col gap-2.5 px-safe-zone py-safe-zone-vertical leading-normal"
                        )}
                    >
                        <Text mono className="text-sm uppercase">
                            About
                        </Text>
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
                            <p
                                className={cn(
                                    "text-pretty text-muted-foreground",
                                    {
                                        md: "text-sm"
                                    }
                                )}
                            >
                                {formatOrdinals(detail.abbreviation)}
                            </p>
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

function renderDuration(duration: string) {
    const parts = duration.split(DASHES_REGEX).map((part) => part.trim())

    if (parts.length <= 1) {
        return duration
    }

    const [start, end] = parts

    return (
        <>
            {start}{" "}
            <Text as="span" className="font-wght-450 dark:font-wght-400">
                —
            </Text>{" "}
            {end}
        </>
    )
}

export default ProjectHeader
