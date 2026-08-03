"use client"

import { Fragment } from "react"

import { ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { LinkButton } from "@/components/ui/button"
import { Highlight } from "@/components/ui/typography"
import {
    getCategoryPath,
    getProjectPath,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { ExpandableWrapper } from "@/portfolio/_components/_layout/expandable-wrapper"
import ProjectCard from "@/portfolio/_components/cards/project-card"
import SelectedProjectCard from "@/portfolio/_components/cards/selected-project-card"
import { MDXContent } from "@/portfolio/_components/mdx-content"
import ProjectHeader from "@/portfolio/_components/project-header"
import SectionTitle from "@/portfolio/_components/section-title"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

import { projects } from "~/.velite"

function Projects({
    selectedWorksStyle
}: {
    selectedWorksStyle?: React.ReactNode
}) {
    const mode = usePortfolioModeStore((state) => state.mode)
    const projectGroups = groupProjectsByCategory(projects)

    if (mode === "spread") {
        return projectGroups.map((group, index) => (
            <Fragment key={group.id}>
                <section>
                    <Space />
                    <SectionLine showDecoration />
                    <Space />
                    <SectionLine />
                    <SectionTitle
                        id={group.id}
                        order={index + 1}
                        title={group.title}
                        note={group.note}
                    />
                    <SectionLine />
                    <div className={cn("bg-background")}>
                        <div className={cn("bg-highlighted/10 p-2")}>
                            <div
                                className={cn(
                                    "flex aspect-3 size-full items-center justify-evenly rounded-2xl border border-highlighted bg-background",
                                    "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-[length:.75rem_.75rem] bg-[position:0_0,.375rem_.375rem]"
                                )}
                            >
                                {group.icons}
                            </div>
                        </div>
                    </div>
                    <SectionLine />
                    <Space />
                    {group.projects.map((project, index) => (
                        <Fragment key={project.slug}>
                            <SectionLine />
                            <article>
                                <ProjectHeader
                                    type={project.type}
                                    projectId={project.id}
                                    projectName={project.name}
                                    category={project.category}
                                    information={project.information}
                                    tools={project.tools}
                                    detail={project.detail}
                                    isSelectedWorks={
                                        group.id === "selected-works"
                                    }
                                />

                                <SectionLine />
                                <Divider />
                                <SectionLine />

                                <ExpandableWrapper
                                    name={project.name}
                                    forceExpand={
                                        project.override
                                            ? project.override.forceExpand
                                            : false
                                    }
                                >
                                    <MDXContent code={project.code} />
                                </ExpandableWrapper>
                                {index < group.projects.length - 1 && (
                                    <>
                                        <SectionLine />
                                        <Space />
                                    </>
                                )}
                            </article>
                        </Fragment>
                    ))}
                </section>
                {index < projectGroups.length - 1 && <SectionLine />}
            </Fragment>
        ))
    }

    return (
        <>
            <Space />
            <SectionLine showDecoration />

            <Space />
            <SectionLine />

            {projectGroups.map((group, groupIndex) => {
                const isSelectedWorks = group.id === "selected-works"

                return (
                    <Fragment key={group.id}>
                        <section className={cn("bg-background @container")}>
                            {isSelectedWorks ? (
                                <>
                                    {selectedWorksStyle}
                                    <LinkButton
                                        data-cursor="target"
                                        href={getCategoryPath(group.id)}
                                        nativeLink
                                        keepFeedback
                                        prefetch={false}
                                        className={cn(
                                            "group flex items-center justify-between gap-4 pe-safe-zone transition-[background-color] duration-100",
                                            {
                                                hover: "bg-highlighted/5 transition-none",
                                                active: "bg-highlighted/10 transition-none"
                                            }
                                        )}
                                    >
                                        <SectionTitle
                                            id={group.id}
                                            title={group.title}
                                            note={group.note}
                                            className={cn(
                                                "flex-1 bg-transparent"
                                            )}
                                        />
                                        <ArrowRight
                                            className={cn(
                                                "transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-highlighted transition-none",
                                                    "group-active":
                                                        "text-highlighted transition-none"
                                                }
                                            )}
                                        />
                                    </LinkButton>
                                    <SectionLine />
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
                                                    href={getProjectPath(
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
                                    <LinkButton
                                        data-cursor="target"
                                        href={getCategoryPath(group.id)}
                                        nativeLink
                                        keepFeedback
                                        prefetch={false}
                                        className={cn(
                                            "group flex items-center justify-between gap-4 pe-safe-zone transition-[background-color] duration-100",
                                            {
                                                hover: "bg-highlighted/5 transition-none",
                                                active: "bg-highlighted/10 transition-none"
                                            }
                                        )}
                                    >
                                        <SectionTitle
                                            id={group.id}
                                            title={group.title}
                                            noteId={
                                                groupIndex === 1
                                                    ? "design-projects"
                                                    : undefined
                                            }
                                            note={
                                                groupIndex === 1
                                                    ? "Design Projects"
                                                    : undefined
                                            }
                                            className={cn(
                                                "flex-1 bg-transparent"
                                            )}
                                        />
                                        <ArrowRight
                                            className={cn(
                                                "transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-highlighted transition-none",
                                                    "group-active":
                                                        "text-highlighted transition-none"
                                                }
                                            )}
                                        />
                                    </LinkButton>
                                    <SectionLine />
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
                                    <Space>
                                        <Highlight
                                            className={cn(
                                                "grid size-full place-items-center bg-highlighted/10 px-safe-zone py-safe-zone-vertical"
                                            )}
                                        >
                                            Below is almost all of my design
                                            projects.
                                        </Highlight>
                                    </Space>
                                    <SectionLine showDecoration />
                                    <Divider />
                                    <SectionLine />
                                    <Space />
                                    <SectionLine />
                                </>
                            ) : (
                                <>
                                    <SectionLine />
                                    <Divider />
                                    <SectionLine />
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
