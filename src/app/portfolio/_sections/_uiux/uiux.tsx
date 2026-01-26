import ProjectHeader from "@/app/portfolio/_components/project-header"
import { Divider } from "@/components/layout/divider"
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
        <section>
            <Space />
            <SectionLine />
            <UIUXHeader />
            <SectionLine />
            <Space />
            <SectionLine />
            {sortedProjects.map((project, index) => (
                <article key={index}>
                    <ProjectHeader
                        projectName={project.projectName}
                        category={project.category}
                        information={project.information}
                        tools={project.tools}
                        detail={project.detail}
                    />

                    <SectionLine />
                    <Divider />
                    <SectionLine />

                    <MDXContent code={project.content} />

                    {index < sortedProjects.length - 1 && <Space />}
                </article>
            ))}
        </section>
    )
}

export default UIUX
