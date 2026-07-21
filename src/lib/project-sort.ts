import { DASHES_REGEX } from "@/helpers/character-regexes"
import { slugify } from "@/helpers/slugify"
import { PROJECT_CATEGORIES } from "@/portfolio/_configs/project-categories"

import { type Project } from "~/.velite"

const MONTHS: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
}

const parseDate = (str: string) => {
    if (!str) return new Date(0)
    const [monthStr, yearStr] = str.trim().split(" ")
    const month = MONTHS[monthStr] ?? 0
    const year = parseInt(yearStr, 10) || 0
    return new Date(year, month, 1)
}

const getDurationDates = (duration: string) => {
    const parts = duration.split(DASHES_REGEX)
    const start = parseDate(parts[0])
    const end = parts.length > 1 ? parseDate(parts[1]) : start
    return { start, end }
}

/**
 * Function to sort Projects by the following logic:
 *
 * 1. Most recent Start Date first.
 * 2. If Start Date is the same, longer Duration first.
 * 3. If both are the same, alphabetical order by project name.
 *
 * @param {Project[]} projects Projects to be sorted
 * @returns {Project[]} Sorted Projects
 */
function sortProjects(projects: Project[]): Project[] {
    const mapped = projects.map((project) => {
        const { start, end } = getDurationDates(project.information.duration)
        return {
            originalProject: project,
            startTime: start.getTime(),
            endTime: end.getTime(),
            name: project.projectName
        }
    })

    mapped.sort((a, b) => {
        const startDiff = b.startTime - a.startTime
        if (startDiff !== 0) return startDiff

        const endDiff = b.endTime - a.endTime
        if (endDiff !== 0) return endDiff

        return a.name.localeCompare(b.name)
    })

    return mapped.map((item) => item.originalProject)
}

interface ProjectGroup {
    id: string
    title: string
    projects: Project[]
    note: string
    icons: React.ReactNode
}

function groupProjectsByCategory(allProjects: Project[]): ProjectGroup[] {
    const sortedAll = sortProjects(allProjects)

    const groups: Record<string, Project[] | undefined> = {}

    sortedAll.forEach((project) => {
        const parts = project.slug.split("/")
        const categorySlug = parts.length > 1 ? parts[1] : null

        if (!categorySlug) return

        groups[categorySlug] ??= []

        groups[categorySlug].push(project)
    })

    return Object.keys(PROJECT_CATEGORIES).reduce<ProjectGroup[]>(
        (acc, cat) => {
            if (groups[cat] && groups[cat].length > 0) {
                const config = PROJECT_CATEGORIES[cat]
                acc.push({
                    id: cat,
                    title: config.title,
                    note: config.note,
                    icons: config.icons,
                    projects: groups[cat] ?? []
                })
            }
            return acc
        },
        []
    )
}

function getProjectRouteSlug(project: Project): string {
    return slugify(project.projectName)
}

function getProjectPath(project: Project): string {
    const parts = project.slug.split("/")
    const category = parts.length > 1 ? parts[1] : null

    if (!category) return "/portfolio"

    return `/portfolio/${category}/${getProjectRouteSlug(project)}`
}

function getCategoryPath(category: string): string {
    return `/portfolio/${category}`
}

export type { ProjectGroup }
export {
    getCategoryPath,
    getProjectPath,
    getProjectRouteSlug,
    groupProjectsByCategory
}
