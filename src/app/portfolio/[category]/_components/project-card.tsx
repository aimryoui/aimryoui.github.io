import { ViewTransition } from "react"
import NextLink from "next/link"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

import { type Project } from "~/.velite"

function ProjectCard({
    href,
    project,
    navigation = "forward",
    projectName,
    category
}: {
    href: string
    project: Project
    navigation?: "forward" | "backward"
    projectName?: string
    category?: string
}) {
    const projectPath = href.replace("/portfolio/", "")

    const coverImageSrc = project.coverImage
        ? (() => {
              const lastDotIndex = project.coverImage.lastIndexOf(".")
              const pathWithoutExt = project.coverImage.slice(0, lastDotIndex)
              const fileName = project.coverImage.slice(
                  project.coverImage.lastIndexOf("/") + 1,
                  lastDotIndex
              )

              return `/assets/media${pathWithoutExt}/${fileName}_preview.webp`
          })()
        : `/assets/media/${projectPath}/1/1_preview.webp`

    return (
        <NextLink
            href={href}
            className={cn(
                "group flex h-20 items-center gap-4 px-6 py-4 will-change-[background-color] transition-[background-color] duration-100",
                {
                    hover: "bg-element-hover transition-none"
                }
            )}
        >
            {navigation === "backward" && (
                <ArrowLeft
                    className={cn(
                        "will-change-[color] transition-[color] duration-100",
                        {
                            "group-hover": "text-highlighted transition-none"
                        }
                    )}
                />
            )}
            <ProjectCover
                projectName={projectName ?? project.projectName}
                navigation={navigation}
                src={coverImageSrc}
            />
            <div
                className={cn(
                    "flex flex-1 flex-col gap-0.5",
                    navigation === "backward" && "items-end"
                )}
            >
                <ProjectName projectName={projectName ?? project.projectName} />
                <ProjectCategory
                    projectName={projectName ?? project.projectName}
                    category={category ?? project.category}
                />
            </div>
            {navigation === "forward" && (
                <ArrowRight
                    className={cn(
                        "will-change-[color] transition-[color] duration-100",
                        {
                            "group-hover": "text-highlighted transition-none"
                        }
                    )}
                />
            )}
        </NextLink>
    )
}

function ProjectCover({
    projectName,
    navigation,
    src
}: {
    projectName: string
    navigation?: "forward" | "backward"
    src: string
}) {
    return (
        <ViewTransition name={formatViewTransitionName(`cover-${projectName}`)}>
            <div
                className={cn(
                    "flex flex-col items-center gap-0.5",
                    navigation === "backward" && "order-last"
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
            >
                <div
                    className={cn(
                        "h-0.5 w-1/3 rounded-t-full bg-muted-foreground opacity-40"
                    )}
                />
                <div
                    className={cn(
                        "h-0.5 w-3/5 rounded-t-full bg-muted-foreground opacity-70"
                    )}
                />
                <img
                    src={src}
                    alt=""
                    className={cn(
                        "aspect-video w-14 rounded-lg border-2 border-muted-foreground/80 object-cover"
                    )}
                    fetchPriority="high"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />
            </div>
        </ViewTransition>
    )
}

function ProjectName({ projectName }: { projectName: string }) {
    return (
        <ViewTransition
            name={formatViewTransitionName(`project-${projectName}`)}
        >
            <Bold
                className={cn(
                    "line-clamp-1 w-fit will-change-[color] transition-[color] duration-100",
                    {
                        "group-hover": "text-highlighted transition-none"
                    }
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
            >
                {formatOrdinal(projectName)}
            </Bold>
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
            <Text
                className={cn(
                    "line-clamp-1 w-fit text-sm will-change-[color] transition-[color] duration-100",
                    {
                        "group-hover": "text-foreground transition-none"
                    }
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
            >
                {category}
            </Text>
        </ViewTransition>
    )
}

export default ProjectCard
