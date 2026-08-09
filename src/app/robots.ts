import { type MetadataRoute } from "next"

import { siteConfig } from "@/configs/site.config"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/private/"]
            },
            {
                userAgent: ["Googlebot", "Bingbot", "Applebot"],
                allow: ["/"],
                disallow: "/private/"
            },
            {
                userAgent: [
                    "anthropic-ai",
                    "CCBot",
                    "Google-Extended",
                    "GPTBot"
                ],
                disallow: ["/"]
            }
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`
    }
}
