"use client"

import { useEffect, useRef, ViewTransition } from "react"

import { Image } from "@/components/media/image"
import { LinkButton, type LinkButtonProps } from "@/components/ui/button"
import { Bold, Text } from "@/components/ui/typography"
import { TRIM_PROJECT_SLUG_REGEX } from "@/helpers/character-regexes"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"
import {
    resolveSocialData,
    type SocialData
} from "@/portfolio/_helpers/resolve-social-data"

import { type Project, type projects } from "~/.velite"

interface SelectedProjectCardProps {
    project: Project
}

const DURATION = 500

function getCoverImagePath(projectPath: string, coverImage?: string) {
    if (!coverImage) return `/${projectPath}/1.jpg`

    return coverImage
}

function SelectedProjectCard({
    className,
    href,
    project,
    ...props
}: LinkButtonProps & SelectedProjectCardProps) {
    const compRef = useRef<HTMLAnchorElement>(null)
    const startTimeRef = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const projectPath = project.filePath.replace(TRIM_PROJECT_SLUG_REGEX, "")

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const coverImagePath = getCoverImagePath(
        projectPath,
        project.features?.selectedCover ?? project.override?.coverImage
    )

    const handleMouseEnter = () => {
        compRef.current?.setAttribute("data-hover", "true")
        startTimeRef.current = Date.now()
        clearTimeout(timeoutRef.current)
    }

    const handleMouseLeave = () => {
        clearTimeout(timeoutRef.current)
        const elapsed = Date.now() - startTimeRef.current
        const remaining = Math.max(DURATION - elapsed, 0)
        timeoutRef.current = setTimeout(() => {
            compRef.current?.removeAttribute("data-hover")
        }, remaining)
    }

    return (
        <LinkButton
            ref={compRef}
            data-cursor="target"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href={href}
            prefetch={false}
            nativeLink={true}
            keepFeedback={true}
            id={`theme-${project.id}`}
            className={cn(
                "group flex h-full min-w-0 flex-col items-center gap-y-[calc(var(--spacing-safe-zone-vertical)/2)] p-safe-zone pb-[calc(var(--spacing-safe-zone-vertical)+var(--spacing)*0.5)] transition-[background-color] duration-100",
                {
                    hover: "bg-highlighted/5 transition-none",
                    active: "bg-highlighted/10 transition-none",
                    before: [
                        "[--pattern-color:var(--color-pattern)]",
                        "pointer-events-none absolute inset-[calc(var(--spacing-safe-zone)*1/3-var(--px)/2)] border border-stroke bg-[repeating-linear-gradient(315deg,var(--pattern-color)_0,var(--pattern-color)_.0625rem,transparent_0,transparent_50%)] bg-[length:.375rem_.375rem]",
                        {
                            "group-hover":
                                "[--pattern-color:var(--color-highlighted)] dark:[--pattern-color:theme(colors.highlighted/0.4)]",
                            "group-active":
                                "[--pattern-color:var(--color-highlighted)] dark:[--pattern-color:theme(colors.highlighted/0.4)]"
                        }
                    ],
                    after: [
                        "[--surface-opacity:0%]",
                        "pointer-events-none absolute inset-[calc(var(--spacing-safe-zone)*2/3-var(--px)/2)] border border-pattern bg-[color-mix(in_srgb,var(--color-highlighted)_var(--surface-opacity),var(--color-background))] transition-[background-color,border-color] duration-100",
                        {
                            "group-hover":
                                "border-stroke transition-none [--surface-opacity:5%]",
                            "group-active":
                                "border-stroke transition-none [--surface-opacity:10%]"
                        }
                    ]
                },
                className
            )}
            {...props}
        >
            <ProjectCover
                projectId={project.id}
                src={coverImagePath}
                social={project.social}
                className={cn("z-1")}
            />
            <div
                className={cn("z-1 flex w-full flex-col gap-0.5", {
                    md: "px-1 pb-1"
                })}
            >
                <ProjectName
                    projectId={project.id}
                    name={project.name}
                    isNew={project.features?.new ?? false}
                />
                <ProjectCategory
                    name={project.name}
                    category={project.category}
                />
            </div>
        </LinkButton>
    )
}

function ProjectCover({
    className,
    projectId,
    social,
    src,
    ...props
}: React.ComponentProps<"div"> & {
    projectId: (typeof projects)[number]["id"]
    src: string
    social?: SocialData
}) {
    const socialData = resolveSocialData(social)

    return (
        <ViewTransition name={`cover-${projectId}-selected`}>
            <div
                className={cn(
                    "relative w-full",
                    {
                        after: [
                            "absolute inset-0 size-full border border-default/15"
                        ]
                    },
                    className
                )}
                {...props}
            >
                <Image
                    lightbox={false}
                    src={src}
                    alt=""
                    asBackgroundImage
                    className="aspect-[4/3]"
                    noBorder
                />
            </div>
        </ViewTransition>
    )
}

function ProjectName({
    className,
    projectId,
    name,
    isNew,
    ...props
}: React.ComponentProps<typeof Bold> & {
    projectId: (typeof projects)[number]["id"]
    name: string
    isNew: boolean
}) {
    return (
        <Bold
            className={cn(
                "relative inline-flex w-fit max-w-full overflow-hidden text-pretty leading-5",
                isNew && "pe-3",
                {
                    md: "text-sm"
                },
                className
            )}
            {...props}
        >
            <ViewTransition name={`project-${projectId}-selected`}>
                <span
                    className={cn(
                        "line-clamp-2 w-fit max-w-full translate-y-0 skew-y-0 transition-[transform,opacity] ease-in-out duration-500",
                        {
                            "group-data-[hover=true]": [
                                "-translate-y-full skew-y-12 opacity-0"
                            ],
                            "group-active": "text-highlighted"
                        }
                    )}
                    style={{
                        viewTransitionName: "none !important"
                    }}
                >
                    {formatOrdinals(name)}
                </span>
            </ViewTransition>
            <span
                aria-hidden={true}
                role="presentation"
                className={cn(
                    "pointer-events-none absolute line-clamp-2 w-fit max-w-full origin-left translate-y-full skew-y-12 text-highlighted opacity-0 transition-[transform,opacity] ease-in-out duration-[500ms,0s] delay-[0s,500ms]",
                    {
                        "group-data-[hover=true]":
                            "translate-y-0 skew-y-0 opacity-100 delay-0"
                    }
                )}
            >
                {formatOrdinals(name)}
            </span>
            {isNew && (
                <ViewTransition name={`project-${projectId}-new-tick-selected`}>
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
                </ViewTransition>
            )}
        </Bold>
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
            name={formatViewTransitionName(
                `category-${name}-${category}-selected`
            )}
        >
            <Text
                className={cn(
                    "line-clamp-2 w-fit max-w-full text-pretty text-sm transition-[color] duration-100",
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

export default SelectedProjectCard
