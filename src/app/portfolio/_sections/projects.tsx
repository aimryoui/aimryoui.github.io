"use client"

import { Fragment } from "react"

import { ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
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
import { MDXContent } from "@/portfolio/_components/mdx-content"
import ProjectHeader from "@/portfolio/_components/project-header"
import SectionTitle from "@/portfolio/_components/section-title"
import ProjectCard from "@/portfolio/[category]/_components/project-card"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

import { projects } from "~/.velite"

function Projects() {
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

            {projectGroups.map((group, groupIndex) => (
                <Fragment key={group.id}>
                    <section className={cn("bg-background")}>
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
                            {group.id === "selected-works" ? (
                                <SectionTitle
                                    id={group.id}
                                    title={group.title}
                                    note={group.note}
                                    className={cn("flex-1 bg-transparent")}
                                />
                            ) : (
                                <SectionTitle
                                    id={group.id}
                                    title={group.title}
                                    noteId={
                                        groupIndex ===
                                        (projectGroups[0]?.id ===
                                        "selected-works"
                                            ? 1
                                            : 0)
                                            ? "design-projects"
                                            : undefined
                                    }
                                    note={
                                        groupIndex ===
                                        (projectGroups[0]?.id ===
                                        "selected-works"
                                            ? 1
                                            : 0)
                                            ? "Design Projects"
                                            : undefined
                                    }
                                    className={cn("flex-1 bg-transparent")}
                                />
                            )}
                            <ArrowRight
                                className={cn(
                                    "m-1 transition-[color] duration-100",
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
                            {group.projects.map((project, index) => (
                                <li
                                    key={project.slug}
                                    className={cn("group", {
                                        odd: "border-r border-dashed border-stroke",
                                        md: "!border-none"
                                    })}
                                >
                                    {group.id === "selected-works" ? (
                                        <ProjectCard
                                            href={getProjectPath(project)}
                                            project={project}
                                        />
                                    ) : (
                                        <ProjectCard
                                            href={getProjectPath(project)}
                                            project={project}
                                        />
                                    )}
                                    {index < group.projects.length - 1 && (
                                        <SectionLine
                                            className={cn({
                                                lg: "w-[calc(100%+var(--spacing-safe-zone))]",
                                                "group-odd": "right-0",
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
                            ))}
                        </ul>
                    </section>
                    {groupIndex < projectGroups.length - 1 ? (
                        group.id === "selected-works" ? (
                            <>
                                <SectionLine />
                                <Divider />
                                <SectionLine showDecoration />
                                <Space>
                                    <Highlight
                                        className={cn(
                                            "grid size-full place-items-center bg-highlighted/10 px-safe-zone py-4.5"
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
            ))}
        </>
    )
}

export default Projects
