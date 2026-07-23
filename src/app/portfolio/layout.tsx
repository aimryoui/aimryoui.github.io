import { type Metadata } from "next"

import { siteConfig } from "@/configs/site.config"
import { Navigation } from "@/portfolio/_components/_layout/navigation"

const APP_PATH_TITLE = "Portfolio | Q3.2026 | Nguyễn Hoàng Nhân"
// const APP_TITLE_TEMPLATE = "%s | Q3.2026 | Nguyễn Hoàng Nhân"
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
            <Navigation />
            {children}
        </>
    )
}
