import { type MetadataRoute } from "next"

import { siteConfig } from "@/config/site.config"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/private/"]
            },
            {
                userAgent: "Googlebot",
                allow: ["/"],
                disallow: "/private/"
            },
            {
                userAgent: [
                    "anthropic-ai",
                    "Applebot",
                    "Bingbot",
                    "CCBot",
                    "Google-Extended",
                    "GPTBot",
                    "Twitterbot"
                ],
                disallow: ["/"]
            }
        ],
        sitemap: siteConfig.url + "/sitemap.xml"
    }
}
