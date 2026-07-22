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
import { type SocialType } from "@/portfolio/[category]/[slug]/_components/social-button"

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
                socialType={
                    project.social?.behance
                        ? "behance"
                        : project.social?.productWebsite
                          ? "product-website"
                          : undefined
                }
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
    socialType,
    src,
    ...props
}: React.ComponentProps<"div"> &
    Pick<ProjectCardProps, "navigation"> & {
        projectName: string
        src: string
    } & SocialType) {
    const socialColor = {
        default:
            socialType === "behance"
                ? "bg-[#0056ff]"
                : socialType === "product-website"
                  ? "bg-[#b18c1b]"
                  : "bg-default"
    }
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
                    {socialType === "behance" ? (
                        <div
                            className={cn(
                                socialColor.default,
                                "absolute -right-1 -top-1 size-4.5 rounded-full border border-default/15 p-0.5 text-white"
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 40 40"
                                className="-translate-y-[.5px] translate-x-[.5px]"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12.662 8.672c1.077 0 2.061.096 2.951.286.89.19 1.65.502 2.284.936a4.367 4.367 0 0 1 1.476 1.73c.35.72.524 1.608.524 2.666 0 1.142-.26 2.094-.778 2.855-.518.762-1.286 1.386-2.3 1.872 1.396.402 2.438 1.106 3.126 2.11.688 1.004 1.032 2.216 1.032 3.634 0 1.142-.222 2.132-.666 2.968a5.76 5.76 0 0 1-1.794 2.046c-.752.53-1.608.92-2.57 1.174a11.6 11.6 0 0 1-2.966.38H2V8.672h10.662Zm-.635 9.17c.888 0 1.618-.213 2.19-.635.572-.424.858-1.11.856-2.062 0-.527-.096-.961-.286-1.3a2.107 2.107 0 0 0-.762-.793 3.224 3.224 0 0 0-1.094-.396 7.28 7.28 0 0 0-1.285-.11H6.984v5.3l5.043-.005Zm.287 9.613c.47.002.937-.046 1.395-.142a3.441 3.441 0 0 0 1.174-.476c.338-.222.608-.524.81-.904.2-.38.302-.868.302-1.46 0-1.162-.328-1.994-.984-2.49-.656-.498-1.524-.746-2.601-.746H6.983v6.22l5.33-.002Zm14.93-.476c.677.656 1.65.984 2.92.984.91 0 1.692-.228 2.348-.682.656-.454 1.058-.936 1.206-1.444h3.966c-.634 1.968-1.608 3.374-2.92 4.22-1.312.846-2.898 1.27-4.76 1.27-1.29 0-2.453-.206-3.49-.618a7.258 7.258 0 0 1-2.633-1.762 7.89 7.89 0 0 1-1.666-2.728c-.39-1.058-.586-2.222-.586-3.49 0-1.226.2-2.368.602-3.426a8.04 8.04 0 0 1 1.714-2.744 8.057 8.057 0 0 1 2.65-1.823c1.026-.444 2.164-.666 3.412-.666 1.395 0 2.611.27 3.65.81a7.285 7.285 0 0 1 2.553 2.173 8.936 8.936 0 0 1 1.444 3.11c.296 1.164.402 2.38.318 3.65H26.137c.062 1.454.432 2.512 1.108 3.166Zm5.094-8.63c-.54-.592-1.36-.888-2.46-.888-.72 0-1.317.122-1.791.364-.476.244-.856.544-1.142.904-.286.36-.486.74-.602 1.142a5.133 5.133 0 0 0-.206 1.078h7.33c-.215-1.14-.59-2.008-1.129-2.6Zm-6.973-8.527h9.157v2.54h-9.157v-2.54Z"
                                />
                            </svg>
                        </div>
                    ) : (
                        socialType === "product-website" && (
                            <div
                                className={cn(
                                    socialColor.default,
                                    "absolute -right-1 -top-1 size-4.5 rounded-full border border-default/15 p-0.5 text-white"
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 40 40"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M20 2C10.075 2 2 10.075 2 20s8.075 18 18 18 18-8.075 18-18S29.925 2 20 2M5.6 20q0-.823.094-1.623c.097-.834.146-1.251.443-1.547.233-.232.655-.379.982-.342.417.048.757.388 1.437 1.068l3.4 3.4c.312.312.467.467.579.65q.148.242.215.52c.05.206.05.427.05.867v1.214c0 .44 0 .66.05.868q.067.276.215.52c.112.182.267.337.579.649l3.713 3.712c.31.312.466.467.578.65q.148.242.215.52c.05.206.05.427.05.867v.106c0 .734 0 1.101-.18 1.392a1.3 1.3 0 0 1-.691.522c-.329.094-.64.005-1.26-.171C10.036 32.127 5.6 26.577 5.6 20m25.794 8.771c-.68-.548-1.564-.988-2.428-1.261-.74-.235-1.11-.352-1.266-.464-.258-.185-.342-.299-.44-.601-.06-.182-.06-.47-.06-1.045a3.6 3.6 0 0 0-3.6-3.6h-4.5c-.839 0-1.258 0-1.589-.137a1.8 1.8 0 0 1-.974-.974c-.137-.331-.137-.75-.137-1.589 0-.521 0-.782.038-.963.097-.468.017-.283.292-.673.107-.151.78-.777 2.124-2.03l.092-.088A3.6 3.6 0 0 0 20 12.8c0-.56 0-.839.091-1.06a1.2 1.2 0 0 1 .65-.649C20.96 11 21.24 11 21.8 11a3.6 3.6 0 0 0 3.6-3.6c0-.353.358-.594.678-.444C30.988 9.251 34.4 14.232 34.4 20c0 3.177-1.058 6.262-3.006 8.771"
                                    />
                                </svg>
                            </div>
                        )
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
