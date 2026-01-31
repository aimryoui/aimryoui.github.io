import { type Metadata } from "next"

import { Divider } from "@/components/layout/divider"
import { MarginLine } from "@/components/layout/line"
import { TableOfContents } from "@/components/table-of-contents"
import { siteConfig } from "@/configs/site.config"
import { groupProjectsByCategory } from "@/lib/project-sort"
import { slugify } from "@/lib/slugify"
import { cn } from "@/lib/utils"
import { projects } from "~/.velite"

const APP_PATH_TITLE = "Portfolio | Q1.2026 | Nguyễn Hoàng Nhân"
// const APP_TITLE_TEMPLATE = "%s | Q1.2026 | Nguyễn Hoàng Nhân"
const APP_DESCRIPTION = "This is my Portfolio Space, come enjoy my artworks"

const APP_FULL_URL = siteConfig.fullUrl
const APP_BASE_PATH = "/portfolio"

export const metadata: Metadata = {
    title: APP_PATH_TITLE,
    description: APP_DESCRIPTION,
    alternates: {
        canonical: APP_FULL_URL + APP_BASE_PATH
    },
    openGraph: {
        title: APP_PATH_TITLE,
        description: APP_DESCRIPTION,
        type: "website",
        url: APP_FULL_URL + APP_BASE_PATH,
        siteName: siteConfig.domain,
        locale: "vi_VN"
    },
    twitter: {
        card: "summary_large_image",
        title: APP_PATH_TITLE,
        description: APP_DESCRIPTION,
        site: APP_FULL_URL + APP_BASE_PATH
    }
}

export default function PortfolioLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const projectGroups = groupProjectsByCategory(projects)
    const projectItems = projectGroups.flatMap((group) => [
        // Project Headers
        {
            id: group.id,
            label: group.title,
            depth: 2 as const
        },
        // Projects
        ...group.projects.map((p) => ({
            id: slugify(p.projectName),
            label: p.projectName,
            depth: 3 as const
        }))
    ])

    const tocItems = [
        { id: "about", label: "About", depth: 1 as const },
        { id: "experiences", label: "Experiences", depth: 3 as const },
        { id: "education", label: "Education", depth: 3 as const },
        { id: "software", label: "Software", depth: 3 as const },
        { id: "contact", label: "Contact", depth: 3 as const },
        { id: "outlines", label: "Outlines", depth: 2 as const },
        ...projectItems
    ]

    return (
        <>
            <TableOfContents items={tocItems} />
            <MarginLine />
            <Divider
                dir="vertical"
                className={cn("sticky top-0 h-dvh w-6.5")}
            />
            <MarginLine />
            {children}
        </>
    )
}
