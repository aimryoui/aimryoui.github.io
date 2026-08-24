"use client"

import NextLink from "next/link"

import { siteConfig } from "@/configs/site.config"
import { useClientSearchParams } from "@/hooks/use-client-search-params"

function Link({ href, ...props }: React.ComponentProps<typeof NextLink>) {
    const searchParams = useClientSearchParams()
    const role = searchParams.get("r")

    let finalHref = href

    if (role && href) {
        if (
            typeof href === "string"
            && href.startsWith("/")
            && !href.startsWith("//")
        ) {
            try {
                const url = new URL(href, siteConfig.url)
                url.searchParams.set("r", role)
                finalHref = url.pathname + url.search + url.hash
            } catch {}
        } else if (
            typeof href === "object"
            && typeof href.pathname === "string"
            && href.pathname.startsWith("/")
        ) {
            finalHref = {
                ...href,
                query: {
                    ...(typeof href.query === "object" ? href.query : {}),
                    r: role
                }
            }
        }
    }

    return <NextLink data-slot="link" href={finalHref} {...props} />
}

export { Link }
