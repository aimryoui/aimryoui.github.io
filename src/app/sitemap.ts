import { type MetadataRoute } from "next"

import { siteConfig } from "@/configs/site.config"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteConfig.url,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        },
        {
            url: siteConfig.url + "/portfolio",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9
        }
    ]
}
