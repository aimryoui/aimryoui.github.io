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
    const year = parseInt(yearStr) || 0
    return new Date(year, month, 1)
}

const getDurationDates = (duration: string) => {
    const parts = duration.split(/\s*[-–—]\s*/)
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
 */
function sortProjects(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
        const timeA = getDurationDates(a.information.duration)
        const timeB = getDurationDates(b.information.duration)

        const startDiff = timeB.start.getTime() - timeA.start.getTime()
        if (startDiff !== 0) return startDiff

        const endDiff = timeB.end.getTime() - timeA.end.getTime()
        if (endDiff !== 0) return endDiff

        return a.projectName.localeCompare(b.projectName)
    })
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

    return Object.keys(PROJECT_CATEGORIES)
        .filter((cat) => groups[cat] && groups[cat].length > 0)
        .map((cat) => {
            const config = PROJECT_CATEGORIES[cat] // Lấy config từ file mới
            return {
                id: cat,
                title: config.title, // 🆕 Lấy từ object config
                note: config.note, // 🆕 Lấy note
                icons: config.icons, // 🆕 Lấy icons
                projects: groups[cat]!
            }
        })
}

export type { ProjectGroup }
export { groupProjectsByCategory }
