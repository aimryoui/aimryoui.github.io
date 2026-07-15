"use client"

import type React from "react"
import { useEffect, useRef, useState, ViewTransition } from "react"
import NextLink from "next/link"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

import { type Project } from "~/.velite"

interface ProjectCardProps {
    project: Project
    navigation?: "forward" | "backward"
    projectNavigation?: boolean
}

const DURATION = 500

function ProjectCard({
    className,
    href,
    project,
    navigation,
    projectNavigation = false,
    ...props
}: React.ComponentProps<typeof NextLink> & ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const startTimeRef = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const hrefPath = typeof href === "string" ? href : (href.pathname ?? "")
    const projectPath = hrefPath.replace("/portfolio/", "")

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

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

    const handleMouseEnter = () => {
        setIsHovered(true)
        startTimeRef.current = Date.now()
        clearTimeout(timeoutRef.current)
    }

    const handleMouseLeave = () => {
        clearTimeout(timeoutRef.current)

        const elapsed = Date.now() - startTimeRef.current
        const remaining = Math.max(DURATION - elapsed, 0)

        timeoutRef.current = setTimeout(() => {
            setIsHovered(false)
        }, remaining)
    }

    const Comp = navigation
        ? navigation === "forward"
            ? PaginationNext
            : PaginationPrevious
        : NextLink

    return (
        <Comp
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-hover={isHovered}
            href={href}
            prefetch={false}
            className={cn(
                "group flex min-h-20 min-w-0 items-center gap-x-4 px-6 py-4 transition-[background-color] duration-100",
                {
                    hover: "bg-highlighted/5 transition-none",
                    active: "bg-highlighted/10 transition-none"
                },
                projectNavigation && {
                    sm: "flex-wrap gap-x-2"
                },
                className
            )}
            {...props}
        >
            {navigation === "backward" && (
                <ArrowLeft
                    className={cn("m-1 transition-[color] duration-100", {
                        "group-hover": "text-highlighted transition-none",
                        "group-active": "text-highlighted transition-none"
                    })}
                />
            )}
            <ProjectCover
                projectName={project.projectName}
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
                    projectName={project.projectName}
                    navigation={navigation}
                    className={cn(navigation === "backward" && "justify-end")}
                />
                <ProjectCategory
                    projectName={project.projectName}
                    category={project.category}
                    className={cn(navigation === "backward" && "text-right")}
                />
            </div>
            {navigation !== "backward" && (
                <ArrowRight
                    className={cn(
                        "m-1 transition-[color] duration-100",
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
    className,
    projectName,
    navigation,
    src,
    ...props
}: React.ComponentProps<"div"> &
    Pick<ProjectCardProps, "navigation"> & {
        projectName: string
        src: string
    }) {
    return (
        <ViewTransition name={formatViewTransitionName(`cover-${projectName}`)}>
            <div
                className={cn(
                    "mb-1 flex h-11 flex-col items-center justify-center gap-0.5",
                    navigation === "backward" && "order-last sm:order-none",
                    className
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
                {...props}
            >
                <div
                    className={cn(
                        "h-0.5 w-1/3 rounded-t-full bg-muted-foreground opacity-40 will-change-transform transition-transform duration-150",
                        {
                            "group-hover": "-translate-y-0.5 scale-y-150",
                            "group-active": "-translate-y-0.5 scale-y-150"
                        }
                    )}
                />
                <div
                    className={cn(
                        "h-0.5 w-3/5 rounded-t-full bg-muted-foreground opacity-70 will-change-transform transition-transform duration-150",
                        {
                            "group-hover": "scale-y-150",
                            "group-active": "scale-y-150"
                        }
                    )}
                />
                {/* oxlint-disable-next-line next/no-img-element */}
                <img
                    src={src}
                    alt=""
                    width={56}
                    height={31.5}
                    className={cn(
                        "aspect-video h-auto w-14 rounded-lg object-cover -outline-offset-2 outline-muted-foreground/80 will-change-transform outline-2 transition-transform duration-150",
                        {
                            "group-hover":
                                "translate-y-0.5 -outline-offset-3 outline-3",
                            "group-active":
                                "translate-y-0.5 -outline-offset-3 outline-3"
                        }
                    )}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />
            </div>
        </ViewTransition>
    )
}

function ProjectName({
    className,
    projectName,
    navigation,
    ...props
}: React.ComponentProps<typeof Bold> &
    Pick<ProjectCardProps, "navigation"> & {
        projectName: string
    }) {
    return (
        <Bold
            className={cn(
                "relative inline-flex w-full overflow-clip",
                className
            )}
            {...props}
        >
            <ViewTransition
                name={formatViewTransitionName(`project-${projectName}`)}
            >
                <span
                    className={cn(
                        "w-fit max-w-full translate-y-0 skew-y-0 truncate transition-[transform,opacity] ease-in-out duration-500",
                        {
                            "group-data-[hover=true]": [
                                "-translate-y-full opacity-0",
                                navigation === "forward"
                                    ? "skew-y-12"
                                    : "-skew-y-12"
                            ],
                            "group-active": "text-highlighted"
                        }
                    )}
                    style={{
                        viewTransitionName: "none !important"
                    }}
                >
                    {formatOrdinal(projectName)}
                </span>
            </ViewTransition>
            <span
                aria-hidden={true}
                role="presentation"
                className={cn(
                    "pointer-events-none absolute w-fit max-w-full translate-y-full truncate text-highlighted opacity-0 transition-[transform,opacity] ease-in-out duration-[500ms,0s] delay-[0s,500ms]",
                    navigation === "forward"
                        ? "origin-left skew-y-12"
                        : "origin-right -skew-y-12",
                    {
                        "group-data-[hover=true]":
                            "translate-y-0 skew-y-0 opacity-100 delay-0"
                    }
                )}
            >
                {formatOrdinal(projectName)}
            </span>
        </Bold>
    )
}

function ProjectCategory({
    className,
    projectName,
    category,
    ...props
}: React.ComponentProps<typeof Text> & {
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
                    "w-fit max-w-full truncate text-sm transition-[color] duration-100",
                    {
                        "group-hover": "text-foreground transition-none",
                        "group-active": "text-foreground transition-none"
                    },
                    className
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
                {...props}
            >
                {category}
            </Text>
        </ViewTransition>
    )
}

export default ProjectCard
