import { ViewTransition } from "react"
import NextLink from "next/link"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

import { type Project } from "~/.velite"

function ProjectCard({
    href,
    project,
    navigation,
    projectNavigation = false,
    projectName,
    category
}: {
    href: string
    project: Project
    navigation?: "forward" | "backward"
    projectNavigation?: boolean
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

    const Comp = navigation
        ? navigation === "forward"
            ? PaginationNext
            : PaginationPrevious
        : NextLink

    return (
        <Comp
            href={href}
            className={cn(
                "group flex min-h-20 min-w-0 items-center gap-x-4 px-6 py-4 will-change-[background-color] transition-[background-color] duration-100",
                "[contain:layout_paint]",
                {
                    hover: "bg-highlighted/5 transition-none",
                    active: "bg-highlighted/10 transition-none"
                },
                projectNavigation && {
                    sm: "flex-wrap gap-x-2"
                }
            )}
        >
            {navigation === "backward" && (
                <ArrowLeft
                    className={cn(
                        "m-1 will-change-[color] transition-[color] duration-100",
                        {
                            "group-hover": "text-highlighted transition-none",
                            "group-active": "text-highlighted transition-none"
                        }
                    )}
                />
            )}
            <ProjectCover
                projectName={projectName ?? project.projectName}
                navigation={navigation}
                src={coverImageSrc}
                className={cn(
                    projectNavigation && navigation === "backward"
                        ? {
                              sm: "ms-auto"
                          }
                        : {
                              sm: "me-auto"
                          }
                )}
            />
            <div
                className={cn(
                    "flex min-w-0 flex-1 flex-col",
                    navigation === "backward" && "items-end",
                    projectNavigation && {
                        sm: "order-3 w-full flex-none"
                    }
                )}
            >
                <ProjectName
                    projectName={projectName ?? project.projectName}
                    projectNavigation={projectNavigation}
                    className={cn(navigation === "backward" && "text-right")}
                />
                <ProjectCategory
                    projectName={projectName ?? project.projectName}
                    projectNavigation={projectNavigation}
                    category={category ?? project.category}
                    className={cn(navigation === "backward" && "text-right")}
                />
            </div>
            {navigation !== "backward" && (
                <ArrowRight
                    className={cn(
                        "m-1 will-change-[color] transition-[color] duration-100",
                        {
                            "group-hover": "text-highlighted transition-none",
                            "group-active": "text-highlighted transition-none"
                        },
                        projectNavigation && {
                            sm: "order-2"
                        }
                    )}
                />
            )}
        </Comp>
    )
}

function ProjectCover({
    projectName,
    navigation,
    src,
    className
}: {
    projectName: string
    navigation?: "forward" | "backward"
    src: string
    className?: string
}) {
    return (
        <ViewTransition name={formatViewTransitionName(`cover-${projectName}`)}>
            <div
                className={cn(
                    "mb-1 flex h-11 flex-col items-center justify-center gap-0.5 will-change-transform transition-[transform] ease-spring duration-300",
                    navigation === "backward" && "order-last sm:order-none",
                    className
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
            >
                <div
                    className={cn(
                        "h-0.5 w-1/3 rounded-t-full bg-muted-foreground opacity-40 will-change-[height,transform] transition-[height,transform] ease-spring duration-300",
                        {
                            "group-hover": "-translate-y-0.5 scale-y-150",
                            "group-active": "-translate-y-0.5 scale-y-150"
                        }
                    )}
                />
                <div
                    className={cn(
                        "h-0.5 w-3/5 rounded-t-full bg-muted-foreground opacity-70 will-change-[height] transition-[height] ease-spring duration-300",
                        {
                            "group-hover": "scale-y-150",
                            "group-active": "scale-y-150"
                        }
                    )}
                />
                <img
                    src={src}
                    alt=""
                    className={cn(
                        "aspect-video w-14 rounded-lg object-cover -outline-offset-2 outline-muted-foreground/80 will-change-[height,transform,outline] outline-2 transition-[height,transform]",
                        {
                            "group-hover":
                                "translate-y-0.5 -outline-offset-3 outline-3",
                            "group-active":
                                "translate-y-0.5 -outline-offset-3 outline-3"
                        }
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

function ProjectName({
    projectName,
    projectNavigation,
    className
}: {
    projectName: string
    projectNavigation: boolean
    className?: string
}) {
    return (
        <ViewTransition
            name={formatViewTransitionName(`project-${projectName}`)}
        >
            <Bold
                className={cn(
                    projectNavigation
                        ? "w-full truncate"
                        : "line-clamp-1 w-fit",
                    {
                        "group-hover": "text-highlighted",
                        "group-active": "text-highlighted"
                    },
                    className
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
    projectNavigation,
    category,
    className
}: {
    projectName: string
    projectNavigation: boolean
    category: string
    className?: string
}) {
    return (
        <ViewTransition
            name={formatViewTransitionName(
                `category-${projectName}-${category}`
            )}
        >
            <Text
                className={cn(
                    "text-sm will-change-[color] transition-[color] duration-100",
                    projectNavigation
                        ? "w-full truncate"
                        : "line-clamp-1 w-fit",
                    {
                        "group-hover": "text-foreground transition-none",
                        "group-active": "text-foreground transition-none"
                    },
                    className
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
