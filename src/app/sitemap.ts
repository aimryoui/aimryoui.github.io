import { type MetadataRoute } from "next"

import { siteConfig } from "@/configs/site.config"
import {
    getCategoryPath,
    getProjectPath,
    groupProjectsByCategory
} from "@/lib/project-sort"

import { projects } from "~/.velite"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()
    const categoryUrls = groupProjectsByCategory(projects).map((group) => ({
        url: `${siteConfig.url}${getCategoryPath(group.id)}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8
    }))

    const projectUrls = projects.map((project) => ({
        url: `${siteConfig.url}${getProjectPath(project)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7
    }))

    return [
        {
            url: siteConfig.url,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1
        },
        {
            url: `${siteConfig.url}/portfolio`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9
        },
        ...categoryUrls,
        ...projectUrls
    ]
}
