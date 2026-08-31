"use client"

import { useEffect, useRef } from "react"

import { ViewTransition } from "@/components/animations/view-transition"
import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { SvgElementLine } from "@/components/layout/line"
import { Link, type LinkProps } from "@/components/ui/link"
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Bold, Text } from "@/components/ui/typography"
import { TRIM_PROJECT_SLUG_REGEX } from "@/helpers/character-regexes"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"
import {
    resolveSocialData,
    type SocialData
} from "@/portfolio/_helpers/resolve-social-data"
import { type ProjectId } from "@/types/project-ids"

import { type Project } from "~/.velite"

interface ProjectCardProps {
    project: Project
    navigation?: "forward" | "backward"
}

const DURATION = 500

function getCoverImagePath(projectPath: string, coverImage?: string) {
    if (!coverImage) return `/assets/media/${projectPath}/1/1_preview.webp`
    const lastDotIndex = coverImage.lastIndexOf(".")
    const pathWithoutExt = coverImage.slice(0, lastDotIndex)
    const fileName = coverImage.slice(
        coverImage.lastIndexOf("/") + 1,
        lastDotIndex
    )

    return `/assets/media${pathWithoutExt}/${fileName}_preview.webp`
}

function ProjectCard({
    className,
    href,
    project,
    navigation,
    onMouseEnter,
    onMouseLeave,
    tracking,
    ...props
}: LinkProps & ProjectCardProps) {
    const compRef = useRef<HTMLAnchorElement>(null)
    const startTimeRef = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const projectPath = project.filePath.replace(TRIM_PROJECT_SLUG_REGEX, "")
    const isSelectedWorks =
        href?.toString().includes("feature=selected") ?? false

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const coverImagePath = getCoverImagePath(
        projectPath,
        project.override?.coverImage
    )

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        clearTimeout(timeoutRef.current)
        startTimeRef.current = Date.now()
        compRef.current?.setAttribute("data-hover", "true")
        onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        clearTimeout(timeoutRef.current)
        const elapsed = Date.now() - startTimeRef.current
        const remaining = Math.max(DURATION - elapsed, 0)
        timeoutRef.current = setTimeout(() => {
            compRef.current?.removeAttribute("data-hover")
        }, remaining)
        onMouseLeave?.(e)
    }

    const Comp = navigation
        ? navigation === "forward"
            ? PaginationNext
            : PaginationPrevious
        : Link

    return (
        <Comp
            ref={compRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href={href}
            prefetch={!!navigation}
            tracking={{
                eventName:
                    tracking?.eventName
                    ?? (navigation ? "navigate_project" : "select_project"),
                eventParams: {
                    project_name: project.name,
                    project_slug: project.slug,
                    direction: navigation ?? "direct_click",
                    section: isSelectedWorks
                        ? "selected_works"
                        : "all_design_works",
                    ...tracking?.eventParams
                }
            }}
            className={cn(
                "group relative flex min-h-space min-w-0 items-center gap-x-4 px-safe-zone py-safe-zone-vertical transition-[background-color] duration-100",
                {
                    hover: "bg-highlighted/5 transition-none",
                    active: "bg-highlighted/10 transition-none"
                },
                navigation && {
                    sm: "flex-wrap gap-x-2"
                },
                className
            )}
            {...props}
        >
            {navigation === "backward" && (
                <ArrowLeft
                    className={cn("transition-[color] duration-100", {
                        rtl: "rotate-180",
                        "group-hover": "text-highlighted transition-none",
                        "group-active": "text-highlighted transition-none"
                    })}
                />
            )}
            <ProjectCover
                projectId={project.id}
                navigation={navigation}
                src={coverImagePath}
                social={project.social}
                className={cn(
                    navigation && navigation === "backward"
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
                    navigation && {
                        sm: "order-3 w-full flex-none"
                    }
                )}
            >
                <ProjectName
                    projectId={project.id}
                    name={project.name}
                    navigation={navigation}
                    isNew={project.features?.new ?? false}
                    isCaseStudy={project.caseStudy}
                    className={cn(navigation === "backward" && "justify-end")}
                />
                <ProjectCategory
                    name={project.name}
                    category={project.category}
                    className={cn(navigation === "backward" && "text-end")}
                />
            </div>
            {navigation !== "backward" && (
                <ArrowRight
                    className={cn(
                        "transition-[color] duration-100",
                        {
                            rtl: "rotate-180",
                            "group-hover": "text-highlighted transition-none",
                            "group-active": "text-highlighted transition-none"
                        },
                        navigation && {
                            sm: "order-2"
                        }
                    )}
                />
            )}
            {!navigation && (
                <SvgElementLine
                    className={cn(
                        "absolute inset-y-0 end-0 group-even:hidden",
                        {
                            md: "hidden"
                        }
                    )}
                />
            )}
        </Comp>
    )
}

function ProjectCover({
    className,
    projectId,
    navigation,
    social,
    src,
    ...props
}: React.ComponentProps<"div"> & {
    projectId?: ProjectId
    src: string
    social?: SocialData
    navigation?: ProjectCardProps["navigation"]
}) {
    const socialData = resolveSocialData(social)

    return (
        <ViewTransition name={`cover-${projectId}`}>
            <div
                className={cn(
                    "flex h-11 -translate-y-0.75 flex-col items-center justify-center gap-0.5",
                    navigation === "backward" && "order-last sm:order-none",
                    !navigation && {
                        sm: "-mt-1 translate-y-0"
                    },
                    className
                )}
                style={{
                    viewTransitionName: "none !important"
                }}
                {...props}
            >
                <div
                    className={cn(
                        "h-0.5 w-1/3 rounded-t-full bg-muted-foreground opacity-40",
                        {
                            "motion-preferred": [
                                "transition-transform ease-in duration-150",
                                {
                                    "group-hover":
                                        "-translate-y-0.5 scale-y-150",
                                    "group-active":
                                        "-translate-y-0.5 scale-y-150"
                                }
                            ]
                        }
                    )}
                />
                <div
                    className={cn(
                        "h-0.5 w-3/5 rounded-t-full bg-muted-foreground opacity-70",
                        {
                            "motion-preferred": [
                                "transition-transform ease-in duration-150",
                                {
                                    "group-hover": "scale-y-150",
                                    "group-active": "scale-y-150"
                                }
                            ]
                        }
                    )}
                />
                <div
                    className={cn("relative rounded-xl", {
                        "motion-preferred": [
                            "transition-transform ease-in duration-150",
                            {
                                "group-hover": "translate-y-0.5",
                                "group-active": "translate-y-0.5"
                            }
                        ],
                        after: [
                            "absolute inset-0 size-full rounded-inherit ring-2 ring-inset ring-muted-foreground/80",
                            {
                                "motion-preferred": {
                                    "group-hover": "ring-3",
                                    "group-active": "ring-3"
                                }
                            }
                        ],
                        md: "rounded-xlg"
                    })}
                >
                    {socialData && (
                        <ViewTransition
                            name={`project-${projectId}-social-button`}
                        >
                            <div
                                className={cn(
                                    socialData.color.default,
                                    "absolute -end-1.5 -top-0.5 z-1 size-5 rounded-full border border-white/15 p-0.5 text-white",
                                    {
                                        md: "-top-1 size-4.5"
                                    }
                                )}
                                style={{
                                    viewTransitionName: "none !important"
                                }}
                            >
                                <socialData.icon
                                    className={cn(
                                        socialData.type === "behance"
                                            && "-translate-y-[.5px] translate-x-[.5px] rtl:-translate-x-[.5px]"
                                    )}
                                />
                            </div>
                        </ViewTransition>
                    )}
                    {/* oxlint-disable-next-line next/no-img-element */}
                    <img
                        src={src}
                        alt=""
                        width={64}
                        height={36}
                        className={cn(
                            "aspect-video h-auto w-16 rounded-inherit object-cover",
                            {
                                md: "w-13"
                            }
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
    projectId,
    name,
    isNew,
    isCaseStudy,
    navigation,
    ...props
}: React.ComponentProps<typeof Bold> & {
    projectId?: ProjectId
    name: string
    isNew: boolean
    isCaseStudy?: boolean
    navigation?: ProjectCardProps["navigation"]
}) {
    return (
        <p className="flex">
            <Bold
                className={cn(
                    "relative inline-flex w-fit max-w-full overflow-hidden",
                    {
                        md: "text-sm"
                    },
                    className
                )}
                {...props}
            >
                <ViewTransition name={`project-${projectId}`}>
                    <bdi
                        translate="no"
                        className={cn(
                            "w-fit max-w-full translate-y-0 skew-y-0 truncate",
                            {
                                "motion-reduced":
                                    "group-hover:text-highlighted",
                                "motion-preferred": [
                                    "transition-[transform,opacity] ease-in-out duration-500",
                                    {
                                        "group-data-[hover=true]": [
                                            "-translate-y-full opacity-0",
                                            navigation === "backward"
                                                ? "-skew-y-12 rtl:skew-y-12"
                                                : "skew-y-12 rtl:-skew-y-12"
                                        ]
                                    }
                                ],
                                "group-active": "text-highlighted"
                            }
                        )}
                        style={{
                            viewTransitionName: "none !important"
                        }}
                    >
                        {formatOrdinals(name)}
                    </bdi>
                </ViewTransition>
                <bdi
                    aria-hidden={true}
                    translate="no"
                    role="presentation"
                    className={cn(
                        "pointer-events-none absolute w-fit max-w-full translate-y-full truncate text-highlighted opacity-0",
                        {
                            "motion-reduced": "hidden",
                            "motion-preferred": [
                                "transition-[transform,opacity] ease-in-out duration-[500ms,0s] delay-[0s,500ms]",
                                navigation === "backward"
                                    ? "origin-right -skew-y-12 rtl:origin-left rtl:skew-y-12"
                                    : "origin-left skew-y-12 rtl:origin-right rtl:-skew-y-12",
                                {
                                    "group-data-[hover=true]":
                                        "translate-y-0 skew-y-0 opacity-100 delay-0"
                                }
                            ]
                        }
                    )}
                >
                    {formatOrdinals(name)}
                </bdi>
            </Bold>
            {isNew && (
                <ViewTransition name={`project-${projectId}-new-tick`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                        aria-hidden={true}
                        className="ms-0.25 inline size-2.75 align-top text-highlighted lg:size-2.5 rtl:-scale-x-100"
                    >
                        <path
                            fill="currentColor"
                            d="M12.195.002c.474.02.944.255 1.29.635s.537.868.515 1.342a1.58 1.58 0 0 1-.63 1.186l-.523.405-9.423 7.296-.524.405a.73.73 0 0 1-.504.14.7.7 0 0 1-.465-.224.7.7 0 0 1-.182-.484.73.73 0 0 1 .186-.49l.45-.484 8.122-8.722.45-.485a1.58 1.58 0 0 1 1.238-.52M10.758 10.106c.455-.149.927-.1 1.317.17s.667.74.763 1.27c.097.53.003 1.067-.267 1.456-.27.391-.694.602-1.173.624l-.402.02-7.26.336-.403.02a.74.74 0 0 1-.48-.17.7.7 0 0 1-.265-.423.7.7 0 0 1 .098-.49.74.74 0 0 1 .39-.327q.193-.06.385-.124l6.913-2.238zM.515 1.817c.378-.285.943-.394 1.514-.313.57.082 1.082.345 1.365.724.287.38.32.845.153 1.3l-.088.244-1.602 4.372-.088.242a.76.76 0 0 1-.328.368.7.7 0 0 1-.464.106.7.7 0 0 1-.415-.232.76.76 0 0 1-.21-.443q-.01-.13-.018-.259L.021 3.281q-.008-.13-.017-.259c-.034-.484.13-.92.51-1.205"
                        />
                    </svg>
                </ViewTransition>
            )}
            {isCaseStudy && (
                <i
                    className={cn(
                        "text-nowrap text-muted-foreground/70 font-wght-450 dark:font-wght-400"
                    )}
                >
                    (Case Study)
                </i>
            )}
        </p>
    )
}

function ProjectCategory({
    className,
    name,
    category,
    ...props
}: React.ComponentProps<typeof Text> & {
    name: string
    category: string
}) {
    return (
        <ViewTransition
            name={formatViewTransitionName(`category-${name}-${category}`)}
        >
            <Text
                className={cn(
                    "w-fit max-w-full truncate text-sm transition-[color] duration-100",
                    {
                        "group-hover": "text-foreground transition-none",
                        "group-active": "text-foreground transition-none",
                        md: "text-xs"
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
