import { useMemo } from "react"

import {
    getCategoryPath,
    getProjectPath,
    getProjectRouteSlug,
    getSelectedProjectPath,
    groupProjectsByCategory
} from "@/lib/project-sort"
import {
    AboutIcon,
    ContactIcon,
    DesignProjectsIcon,
    EducationIcon,
    ExperienceIcon,
    SelectedWorksIcon,
    SoftwareIcon
} from "@/portfolio/_components/_icons/toc-icons"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/types/toc"
import { useQueryStore } from "@/stores/query-store"

import { projects } from "~/.velite"

function useTocItems() {
    const role = useQueryStore((s) => s.role)

    return useMemo(() => {
        const projectGroups = groupProjectsByCategory(projects, role)

        const selectedWorksGroup = projectGroups.find(
            (g) => g.id === "selected-works"
        )
        const otherGroups = projectGroups.filter(
            (g) => g.id !== "selected-works"
        )

        const createGroupItems = (group: (typeof projectGroups)[0]) => {
            const items: TocItemProps[] = [
                {
                    id: group.id,
                    label: group.title,
                    depth: 2,
                    kind: "project",
                    icon:
                        group.id === "selected-works" ? (
                            <SelectedWorksIcon />
                        ) : undefined,
                    mode: "route",
                    href: getCategoryPath(group.id)
                }
            ]

            for (const project of group.projects) {
                items.push({
                    id: getProjectRouteSlug(project),
                    label: project.name,
                    depth: 3,
                    kind: "project",
                    mode: "route",
                    caseStudy: project.caseStudy,
                    href:
                        group.id === "selected-works"
                            ? getSelectedProjectPath(project)
                            : getProjectPath(project)
                })
            }

            return items
        }

        const selectedWorksItems = selectedWorksGroup
            ? createGroupItems(selectedWorksGroup)
            : []
        const designProjectItems = otherGroups.flatMap(createGroupItems)

        const staticItemMode = "route"

        const tocItems: TocItemProps[] = [
            {
                id: "about",
                label: "About",
                depth: 3,
                kind: "static",
                icon: <AboutIcon />,
                mode: staticItemMode,
                href: "/portfolio#about"
            },
            {
                id: "experience",
                label: "Experience",
                depth: 3,
                kind: "static",
                icon: <ExperienceIcon />,
                mode: staticItemMode,
                href: "/portfolio#experience"
            },
            {
                id: "education",
                label: "Education",
                depth: 3,
                kind: "static",
                icon: <EducationIcon />,
                mode: staticItemMode,
                href: "/portfolio#education"
            },
            {
                id: "software",
                label: "Software",
                depth: 3,
                kind: "static",
                icon: <SoftwareIcon />,
                mode: staticItemMode,
                href: "/portfolio#software"
            },
            {
                id: "contact",
                label: "Contact",
                depth: 3,
                kind: "static",
                icon: <ContactIcon />,
                mode: staticItemMode,
                href: "/portfolio#contact"
            },
            ...selectedWorksItems,
            {
                id: "design-projects",
                label: "Design Projects",
                depth: 4,
                kind: "static",
                icon: <DesignProjectsIcon />,
                mode: staticItemMode,
                href: "/portfolio#design-projects"
            },
            {
                id: "alert",
                label: "Alert",
                depth: 2,
                kind: "static",
                hidden: true
            }, // Hidden
            ...designProjectItems,
            {
                id: "footer",
                label: "Footer",
                depth: 2,
                kind: "static",
                hidden: true
            } // Hidden
        ]

        return tocItems
    }, [role])
}

export { useTocItems }
