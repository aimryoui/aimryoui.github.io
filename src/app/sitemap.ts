import { type MetadataRoute } from "next"

import { siteConfig } from "@/configs/site.config"
import {
    getCategoryPath,
    getProjectPath,
    groupProjectsByCategory
} from "@/lib/project-sort"

import { projects } from "~/.velite"

export const dynamic = "force-static"

const now = new Date()

const categoryUrls = groupProjectsByCategory(projects).map((group) => ({
    url: `${siteConfig.url}${getCategoryPath(group.id)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
})) as MetadataRoute.Sitemap

const projectUrls = projects.map((project) => ({
    url: `${siteConfig.url}${getProjectPath(project)}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.9
})) as MetadataRoute.Sitemap

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteConfig.url,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8
        },
        {
            url: `${siteConfig.url}/portfolio`,
            lastModified: now,
            changeFrequency: "hourly",
            priority: 1
        },
        ...categoryUrls,
        ...projectUrls
    ]
}
