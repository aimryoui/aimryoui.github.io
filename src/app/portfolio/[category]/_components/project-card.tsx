"use client"

import type React from "react"
import { useEffect, useRef, useState, ViewTransition } from "react"
import NextLink from "next/link"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"
import {
    resolveSocialData,
    type SocialData
} from "@/portfolio/_helpers/resolve-social-data"

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

    const coverImage = project.override?.coverImage

    const coverImagePath = coverImage
        ? (() => {
              const lastDotIndex = coverImage.lastIndexOf(".")
              const pathWithoutExt = coverImage.slice(0, lastDotIndex)
              const fileName = coverImage.slice(
                  coverImage.lastIndexOf("/") + 1,
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
            draggable={false}
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
                src={coverImagePath}
                social={project.social}
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
                    isNew={project.information.newest}
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
    social,
    src,
    ...props
}: React.ComponentProps<"div"> &
    Pick<ProjectCardProps, "navigation"> & {
        projectName: string
        src: string
        social?: SocialData
    }) {
    const socialData = resolveSocialData(social)

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
                <div
                    className={cn(
                        "relative rounded-lg -outline-offset-2 outline-muted-foreground/80 will-change-transform outline-2 transition-transform duration-150",
                        {
                            "group-hover":
                                "translate-y-0.5 -outline-offset-3 outline-3",
                            "group-active":
                                "translate-y-0.5 -outline-offset-3 outline-3"
                        }
                    )}
                >
                    {socialData && (
                        <div
                            className={cn(
                                socialData.color.default,
                                "absolute -right-1.5 -top-1 size-4.5 rounded-full border border-white/15 p-0.5 text-white"
                            )}
                        >
                            <socialData.icon
                                className={cn(
                                    socialData.type === "behance" &&
                                        "-translate-y-[.5px] translate-x-[.5px]"
                                )}
                            />
                        </div>
                    )}
                    {/* oxlint-disable-next-line next/no-img-element */}
                    <img
                        src={src}
                        alt=""
                        width={56}
                        height={31.5}
                        className={cn(
                            "aspect-video h-auto w-14 rounded-lg object-cover"
                        )}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                    />
                </div>
            </div>
        </ViewTransition>
    )
}

function ProjectName({
    className,
    projectName,
    isNew,
    navigation,
    ...props
}: React.ComponentProps<typeof Bold> &
    Pick<ProjectCardProps, "navigation"> & {
        projectName: string
        isNew: boolean
    }) {
    return (
        <Bold
            className={cn(
                "relative inline-flex w-fit max-w-full overflow-hidden pe-3",
                className
            )}
            {...props}
        >
            <ViewTransition
                name={formatViewTransitionName(`project-${projectName}`)}
            >
                <span
                    className={cn(
                        "w-fit max-w-full translate-y-0 skew-y-0 truncate will-change-transform transition-[transform,opacity] ease-in-out duration-500",
                        {
                            "group-data-[hover=true]": [
                                "-translate-y-full opacity-0",
                                navigation === "backward"
                                    ? "-skew-y-12"
                                    : "skew-y-12"
                            ],
                            "group-active": "text-highlighted"
                        }
                    )}
                    style={{
                        viewTransitionName: "none !important"
                    }}
                >
                    {formatOrdinals(projectName)}
                </span>
            </ViewTransition>
            <span
                aria-hidden={true}
                role="presentation"
                className={cn(
                    "pointer-events-none absolute w-fit max-w-full translate-y-full truncate text-highlighted opacity-0 will-change-transform transition-[transform,opacity] ease-in-out duration-[500ms,0s] delay-[0s,500ms]",
                    navigation === "backward"
                        ? "origin-right -skew-y-12"
                        : "origin-left skew-y-12",
                    {
                        "group-data-[hover=true]":
                            "translate-y-0 skew-y-0 opacity-100 delay-0"
                    }
                )}
            >
                {formatOrdinals(projectName)}
            </span>
            {isNew && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    className="absolute right-0 top-0 size-2.75 text-highlighted lg:size-2.5"
                >
                    <path
                        fill="currentColor"
                        d="M12.195.002c.474.02.944.255 1.29.635s.537.868.515 1.342a1.58 1.58 0 0 1-.63 1.186l-.523.405-9.423 7.296-.524.405a.73.73 0 0 1-.504.14.7.7 0 0 1-.465-.224.7.7 0 0 1-.182-.484.73.73 0 0 1 .186-.49l.45-.484 8.122-8.722.45-.485a1.58 1.58 0 0 1 1.238-.52M10.758 10.106c.455-.149.927-.1 1.317.17s.667.74.763 1.27c.097.53.003 1.067-.267 1.456-.27.391-.694.602-1.173.624l-.402.02-7.26.336-.403.02a.74.74 0 0 1-.48-.17.7.7 0 0 1-.265-.423.7.7 0 0 1 .098-.49.74.74 0 0 1 .39-.327q.193-.06.385-.124l6.913-2.238zM.515 1.817c.378-.285.943-.394 1.514-.313.57.082 1.082.345 1.365.724.287.38.32.845.153 1.3l-.088.244-1.602 4.372-.088.242a.76.76 0 0 1-.328.368.7.7 0 0 1-.464.106.7.7 0 0 1-.415-.232.76.76 0 0 1-.21-.443q-.01-.13-.018-.259L.021 3.281q-.008-.13-.017-.259c-.034-.484.13-.92.51-1.205"
                    />
                </svg>
            )}
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
