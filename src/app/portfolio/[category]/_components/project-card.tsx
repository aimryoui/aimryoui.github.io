import { ViewTransition } from "react"

import { Bold, Text } from "@/components/ui/typography"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

import { type Project } from "~/.velite"

function ProjectCard({ project }: { project: Project }) {
    return (
        <>
            <ViewTransition
                name={formatViewTransitionName(
                    `project-${project.projectName}`
                )}
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
                    {project.projectName}
                </Bold>
            </ViewTransition>
            <ViewTransition
                name={formatViewTransitionName(
                    `category-${project.projectName}-${project.category}`
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
                    {project.category}
                </Text>
            </ViewTransition>
        </>
    )
}

export default ProjectCard
