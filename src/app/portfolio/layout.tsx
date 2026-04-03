import { type Metadata } from "next"

import { Divider } from "@/components/layout/divider"
import { MarginLine } from "@/components/layout/line"
import { siteConfig } from "@/configs/site.config"
import { cn } from "@/lib/utils"
import Sidebar from "@/portfolio/_components/_layout/sidebar"

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
    return (
        <>
            <Sidebar />
            <MarginLine className={cn("ms-sidebar lg:hidden")} />
            <Divider
                dir="vertical"
                className={cn("sticky top-0 h-dvh lg:hidden")}
            />
            <MarginLine className={cn("lg:hidden")} />
            {children}
        </>
    )
}
