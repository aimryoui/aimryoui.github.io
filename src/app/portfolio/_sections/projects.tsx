"use client"

import { Fragment } from "react"
import NextLink from "next/link"

import { ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
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

    if (mode === "pages") {
        return (
            <>
                <Space />
                <SectionLine showDecoration />

                <Space />
                <SectionLine />

                {projectGroups.map((group, groupIndex) => (
                    <Fragment key={group.id}>
                        <section className={cn("bg-background")}>
                            <NextLink
                                href={getCategoryPath(group.id)}
                                className={cn(
                                    "group flex items-center justify-between gap-4 bg-element-hover pe-6 will-change-[background-color] transition-[background-color] duration-100",
                                    {
                                        hover: "bg-highlighted/8 transition-none"
                                    }
                                )}
                            >
                                <SectionTitle
                                    id={group.id}
                                    title={group.title}
                                    noteId={
                                        groupIndex === 0
                                            ? "projects"
                                            : undefined
                                    }
                                    note={
                                        groupIndex === 0
                                            ? "Projects"
                                            : undefined
                                    }
                                    className={cn("flex-1 bg-transparent")}
                                />
                                <ArrowRight
                                    className={cn(
                                        "will-change-[color] transition-[color] duration-100",
                                        {
                                            "group-hover":
                                                "text-highlighted transition-none"
                                        }
                                    )}
                                />
                            </NextLink>
                            <SectionLine />
                            <div
                                className={cn(
                                    "grid grid-cols-2 bg-background md:grid-cols-1"
                                )}
                            >
                                {group.projects.map((project, index) => (
                                    <div
                                        key={project.slug}
                                        className={cn({
                                            "[&:nth-child(odd)]":
                                                "border-r border-dashed border-stroke",
                                            md: "border-none"
                                        })}
                                    >
                                        <ProjectCard
                                            href={getProjectPath(project)}
                                            project={project}
                                        />
                                        {index < group.projects.length - 1 && (
                                            <SectionLine />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                        {groupIndex < projectGroups.length - 1 ? (
                            <>
                                <SectionLine />
                                <Divider />
                                <SectionLine />
                            </>
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
                                "bg-[radial-gradient(oklch(from_var(--stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-position-[0_0,.375rem_.375rem] bg-size-[.75rem_.75rem]"
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
                                projectName={project.projectName}
                                category={project.category}
                                information={project.information}
                                tools={project.tools}
                                detail={project.detail}
                            />

                            <SectionLine />
                            <Divider />
                            <SectionLine />

                            <ExpandableWrapper
                                projectName={project.projectName}
                                forceExpand={project.forceExpand}
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

export default Projects
