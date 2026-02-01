import React from "react"

import { ExpandableWrapper } from "@/app/portfolio/_components/_layout/expandable-wrapper"
import { MDXContent } from "@/app/portfolio/_components/mdx-content"
import ProjectHeader from "@/app/portfolio/_components/project-header"
import SectionTitle from "@/app/portfolio/_components/section-title"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { projects } from "~/.velite"

function Projects() {
    const projectGroups = groupProjectsByCategory(projects)

    return projectGroups.map((group, index) => (
        <section key={group.id}>
            <Space />
            <SectionLine showDecoration />
            <Space />
            <SectionLine />
            <SectionTitle
                id={group.id}
                order={index + 1}
                level={2}
                title={group.title}
                note={group.note}
            />
            <SectionLine />
            <div className={cn("bg-background")}>
                <div className={cn("bg-highlighted/10 p-2")}>
                    <div
                        className={cn(
                            "bg-background border-highlighted flex aspect-3/1 size-full items-center justify-evenly rounded-2xl border bg-[radial-gradient(oklch(from_var(--stroke-foreground)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--stroke-foreground)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-size-[.75rem_.75rem] bg-fixed bg-position-[0_0,.375rem_.375rem]"
                        )}
                    >
                        {group.icons}
                    </div>
                </div>
            </div>
            <SectionLine />
            <Space />
            {group.projects.map((project, index) => (
                <React.Fragment key={index}>
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

                        <ExpandableWrapper projectName={project.projectName}>
                            <MDXContent code={project.code} />
                        </ExpandableWrapper>
                        {index < group.projects.length - 1 ? (
                            <>
                                <SectionLine />
                                <Space />
                            </>
                        ) : (
                            <SectionLine />
                        )}
                    </article>
                </React.Fragment>
            ))}
        </section>
    ))
}

export default Projects
