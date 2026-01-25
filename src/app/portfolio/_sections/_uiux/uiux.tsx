import React from "react"

import ProjectHeader from "@/app/portfolio/_components/project-header"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { MDXContent } from "@/components/mdx-content"
import { projects } from "~/.velite"

import UIUXHeader from "./header"

function UIUX() {
    const sortedProjects = projects.sort((a, _) =>
        a.information.newest ? -1 : 1
    )

    return (
        <section id="uiux">
            <Space />
            <SectionLine />
            <UIUXHeader />
            <SectionLine />
            <Space />
            <SectionLine />
            {sortedProjects.map((project, index) => (
                <React.Fragment key={index}>
                    <ProjectHeader
                        projectName={project.projectName}
                        category={project.category}
                        information={project.information}
                        tools={project.tools}
                        detail={project.detail}
                    />

                    <SectionLine />

                    <MDXContent code={project.content} />

                    {index < sortedProjects.length - 1 && <Space />}
                </React.Fragment>
            ))}
        </section>
    )
}

export default UIUX
