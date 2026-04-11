import { ViewTransition } from "react"
import { type Url } from "next/dist/shared/lib/router/router"
import NextLink from "next/link"

import { ArrowRight } from "@/components/icons/icons"
import { Bold, Text } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

import { type Project } from "~/.velite"

function ProjectCard({ href, project }: { href: Url; project: Project }) {
    return (
        <NextLink
            href={href}
            className={cn(
                "group flex h-20 items-center justify-between gap-4 px-6 py-4 will-change-[background-color] transition-[background-color] duration-100",
                {
                    hover: "bg-element-hover transition-none"
                }
            )}
        >
            <div className={cn("flex flex-col gap-1")}>
                <ProjectName projectName={project.projectName} />
                <ProjectCategory
                    projectName={project.projectName}
                    category={project.category}
                />
            </div>
            <ArrowRight
                className={cn(
                    "will-change-[color] transition-[color] duration-100",
                    {
                        "group-hover": "text-highlighted transition-none"
                    }
                )}
            />
        </NextLink>
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
