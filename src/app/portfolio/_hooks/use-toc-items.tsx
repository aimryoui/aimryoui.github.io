import { useMemo } from "react"

import {
    getCategoryPath,
    getProjectPath,
    getProjectRouteSlug,
    groupProjectsByCategory
} from "@/lib/project-sort"
import {
    AboutIcon,
    AdoptMeIcon,
    ContactIcon,
    DesignProjectsIcon,
    EducationIcon,
    ExperienceIcon,
    SelectedWorksIcon,
    SoftwareIcon
} from "@/portfolio/_components/_icons/toc-icons"
import { type TocItemProps } from "@/portfolio/_components/_layout/toc/toc-item-row"
import { type PortfolioMode } from "@/stores/portfolio-mode-store"

import { projects } from "~/.velite"

function useTocItems(mode: PortfolioMode) {
    return useMemo(() => {
        const projectGroups = groupProjectsByCategory(projects)

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
                    mode: mode === "pages" ? "route" : "anchor",
                    href:
                        mode === "pages"
                            ? getCategoryPath(group.id)
                            : `#${group.id}`
                }
            ]

            for (const project of group.projects) {
                items.push({
                    id: getProjectRouteSlug(project),
                    label: project.name,
                    depth: 3,
                    kind: "project",
                    mode: mode === "pages" ? "route" : "anchor",
                    href:
                        mode === "pages"
                            ? group.id === "selected-works"
                                ? `/portfolio/selected-works/${getProjectRouteSlug(project)}`
                                : getProjectPath(project)
                            : `#${getProjectRouteSlug(project)}`
                })
            }

            return items
        }

        const selectedWorksItems = selectedWorksGroup
            ? createGroupItems(selectedWorksGroup)
            : []
        const designProjectItems = otherGroups.flatMap(createGroupItems)

        const staticItemMode = mode === "pages" ? "route" : "anchor"

        const tocItems: TocItemProps[] = [
            {
                id: "about",
                label: "About",
                depth: 3,
                kind: "static",
                icon: <AboutIcon />,
                mode: staticItemMode,
                href: mode === "pages" ? "/portfolio#about" : "#about"
            },
            {
                id: "experience",
                label: "Experience",
                depth: 3,
                kind: "static",
                icon: <ExperienceIcon />,
                mode: staticItemMode,
                href: mode === "pages" ? "/portfolio#experience" : "#experience"
            },
            {
                id: "education",
                label: "Education",
                depth: 3,
                kind: "static",
                icon: <EducationIcon />,
                mode: staticItemMode,
                href: mode === "pages" ? "/portfolio#education" : "#education"
            },
            {
                id: "software",
                label: "Software",
                depth: 3,
                kind: "static",
                icon: <SoftwareIcon />,
                mode: staticItemMode,
                href: mode === "pages" ? "/portfolio#software" : "#software"
            },
            {
                id: "contact",
                label: "Contact",
                depth: 3,
                kind: "static",
                icon: <ContactIcon />,
                mode: staticItemMode,
                href: mode === "pages" ? "/portfolio#contact" : "#contact"
            },
            ...selectedWorksItems,
            {
                id: "design-projects",
                label: "Design Projects",
                depth: 4,
                kind: "static",
                icon: <DesignProjectsIcon />,
                mode: staticItemMode,
                href: "/portfolio#design-projects",
                hidden: mode === "spread"
            },
            {
                id: "alert",
                label: "Alert",
                depth: 2,
                kind: "static",
                hidden: true
            }, // Hidden
            {
                id: "outlines",
                label: "Outlines",
                depth: 2,
                kind: "static",
                hidden: mode === "pages"
            },
            ...designProjectItems,
            {
                id: "footer",
                label: "Footer",
                depth: 2,
                kind: "static",
                hidden: true
            }, // Hidden
            {
                id: "adopt-me",
                label: "Adopt Me",
                depth: 4,
                kind: "static",
                icon: <AdoptMeIcon />,
                mode: staticItemMode,
                href: "#adopt-me",
                hidden: mode === "pages"
            }
        ]

        return tocItems
    }, [mode])
}

export { useTocItems }
