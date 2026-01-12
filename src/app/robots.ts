import { type MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/images/"]
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
        sitemap: "https://hoangnhan2ka3.github.io/porfolio/sitemap.xml"
    }
}
