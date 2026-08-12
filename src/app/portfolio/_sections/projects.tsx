"use client"

import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import { Note } from "@/components/layout/note"
import { Space } from "@/components/layout/space"
import { getProjectPath, getSelectedProjectPath, groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import ProjectCard from "@/portfolio/_components/cards/project-card"
import SelectedProjectCard from "@/portfolio/_components/cards/selected-project-card"
import SectionTitle from "@/portfolio/_components/section-title"

import { projects } from "~/.velite"

function Projects({
    selectedWorksStyle
}: {
    selectedWorksStyle?: React.ReactNode
}) {
    const projectGroups = groupProjectsByCategory(projects)

    return (
        <>
            <Space />
            <SectionLine showDecoration />

            <Space />
            <SectionLine containerClassName="z-55" />

            {projectGroups.map((group, groupIndex) => {
                const isSelectedWorks = group.id === "selected-works"
                const isDesignProjects = groupIndex === 1

                return (
                    <Fragment key={group.id}>
                        <section className={cn("bg-background @container")}>
                            {isSelectedWorks ? (
                                <>
                                    {selectedWorksStyle}
                                    <SectionTitle
                                        id={group.id}
                                        title={group.title}
                                        note={group.note}
                                        link="route"
                                    />
                                    <ul
                                        className={cn(
                                            "grid grid-cols-5 bg-background @3xl:grid-cols-3 @md:grid-cols-2"
                                        )}
                                    >
                                        {group.projects.map((project) => (
                                            <li
                                                key={project.slug}
                                                className="group relative"
                                            >
                                                <SelectedProjectCard
                                                    href={getSelectedProjectPath(
                                                        project
                                                    )}
                                                    project={project}
                                                />
                                                {/* Represent border-right */}
                                                <SvgElementLine
                                                    className={cn(
                                                        "absolute inset-y-0 right-0 group-nth-[5n]:hidden",
                                                        {
                                                            "@3xl": "group-nth-[5n]:block group-nth-[3n]:hidden",
                                                            "@md": "group-even:!hidden group-nth-[3n]:block"
                                                        }
                                                    )}
                                                />
                                                {/* Represent border-bottom */}
                                                <SectionLine
                                                    containerClassName={cn(
                                                        "absolute inset-x-0 bottom-0 hidden",
                                                        {
                                                            "group-nth-5":
                                                                "block",
                                                            "@3xl": "group-nth-5:hidden group-nth-[3n]:block",
                                                            lg: [
                                                                {
                                                                    "@3xl": "group-nth-[3n+1]:block group-nth-[3n]:hidden"
                                                                }
                                                            ],
                                                            "@md": "group-not-last:block group-not-nth-last-2:block"
                                                        }
                                                    )}
                                                    className={cn({
                                                        lg: [
                                                            "-right-safe-zone left-auto",
                                                            {
                                                                "@3xl": "-left-safe-zone right-auto"
                                                            }
                                                        ],
                                                        "@md": {
                                                            "group-odd":
                                                                "-left-safe-zone right-auto",
                                                            "group-even":
                                                                "-right-safe-zone left-auto"
                                                        }
                                                    })}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <SectionTitle
                                        id={group.id}
                                        title={group.title}
                                        link="route"
                                        {...(isDesignProjects && {
                                            noteId: "design-projects",
                                            note: "Design Projects",
                                            noteClassName:
                                                "lg:scroll-mt-[calc(var(--spacing-space)*2-1rem-1em*1.5+var(--spacing-safe-zone)*2)] md:scroll-mt-[calc(var(--spacing-space)*2-.75rem-1.25rem+var(--spacing-safe-zone)*2)]"
                                        })}
                                    />
                                    <ul
                                        className={cn(
                                            "grid grid-cols-2 bg-background md:grid-cols-1"
                                        )}
                                    >
                                        {group.projects.map(
                                            (project, index) => (
                                                <li
                                                    key={project.slug}
                                                    className="group"
                                                >
                                                    <ProjectCard
                                                        href={getProjectPath(
                                                            project
                                                        )}
                                                        project={project}
                                                    />
                                                    {index <
                                                        group.projects.length -
                                                            1 && (
                                                        <SectionLine
                                                            className={cn({
                                                                lg: "w-[calc(100%+var(--spacing-safe-zone))]",
                                                                "group-odd":
                                                                    "right-0",
                                                                "group-even": [
                                                                    "w-[calc(100%+var(--spacing-safe-zone))]",
                                                                    {
                                                                        lg: "-right-safe-zone left-auto"
                                                                    }
                                                                ]
                                                            })}
                                                        />
                                                    )}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </>
                            )}
                        </section>
                        {groupIndex < projectGroups.length - 1 ? (
                            isSelectedWorks ? (
                                <>
                                    <SectionLine />
                                    <Divider />
                                    <SectionLine showDecoration />
                                    <Note bold>
                                        Below is almost all of my design
                                        projects.
                                    </Note>
                                    <SectionLine showDecoration />
                                    <Divider />
                                    <SectionLine />
                                    <Space />
                                    <SectionLine containerClassName="z-55" />
                                </>
                            ) : (
                                <>
                                    <SectionLine />
                                    <Divider />
                                    <SectionLine containerClassName="z-55" />
                                </>
                            )
                        ) : (
                            <>
                                <SectionLine />
                                <Divider />
                            </>
                        )}
                    </Fragment>
                )
            })}
        </>
    )
}

export default Projects
