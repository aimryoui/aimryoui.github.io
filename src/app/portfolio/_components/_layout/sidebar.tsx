import { SectionLine } from "@/components/layout/line"
import { ModeToggle } from "@/components/mode-toggle"
import { slugify } from "@/helpers/slugify"
import { groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { TableOfContents } from "@/portfolio/_components/_layout/table-of-contents"

import { projects } from "~/.velite"

function Sidebar() {
    const projectGroups = groupProjectsByCategory(projects)
    const projectItems = projectGroups.flatMap((group) => [
        // Project Headers
        {
            id: group.id,
            label: group.title,
            depth: 2 as const
        },
        // Projects
        ...group.projects.map((p) => ({
            id: slugify(p.projectName),
            label: p.projectName,
            depth: 3 as const
        }))
    ])

    const tocItems = [
        { id: "about", label: "About", depth: 1 as const },
        { id: "experiences", label: "Experiences", depth: 3 as const },
        { id: "education", label: "Education", depth: 3 as const },
        { id: "software", label: "Software", depth: 3 as const },
        { id: "contact", label: "Contact", depth: 3 as const },
        { id: "outlines", label: "Outlines", depth: 2 as const },
        ...projectItems
        // { id: "footer", label: "Footer", depth: 3 as const }
    ]

    return (
        <aside
            className={cn(
                "sticky top-0 z-10 flex h-dvh w-78 flex-col justify-end lg:hidden"
            )}
        >
            <TableOfContents items={tocItems} />
            <SectionLine fit />
            <div className={cn("w-full bg-background px-6 py-5.5")}>
                <ModeToggle />
            </div>
        </aside>
    )
}

export default Sidebar
