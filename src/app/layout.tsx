import "./globals.css"

import { type Metadata, type Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"

import { MarginLine } from "@/components/layout/line"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site.config"
import { cn } from "@/lib/utils"

// export const metadata: Metadata = {
//     title: "Portfolio | Q1.2026 | Nguyễn Hoàng Nhân",
//     description:
//         "Designing with purpose and passion. Discover a collection of creative works and UI/UX projects that bring imagination to life.",
//     robots: "noimageai"
// }

const lastModified = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Saigon"
})

const title = "Portfolio | Q1.2026 | Nguyễn Hoàng Nhân"
const description =
    "Designing with purpose and passion. Discover a collection of creative works and UI/UX projects that bring imagination to life."

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: title,
    description: description,
    generator: siteConfig.name,
    applicationName: siteConfig.domain,
    authors: [{ name: siteConfig.name }, { url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    keywords: [
        "website",
        "portfolio",
        "artworks",
        "Hoang Nhan",
        "Hoàng Nhân",
        "Hoàng Nhân designer",
        "Nguyễn Hoàng Nhân",
        "Nguyễn Hoàng Nhân designer",
        "developer",
        "designer",
        "artist",
        "nhn",
        "hoangnhan"
    ],
    category:
        "portfolio, project, artworks, designer, developer, artist, website",
    referrer: "origin-when-cross-origin",
    other: {
        language: "en",
        distribution: "global",
        rating: "general",
        "format-detection": "telephone=yes, address=no, email=yes",
        "identifier-URL": siteConfig.url,
        "reply-to": siteConfig.email.work,
        revised: lastModified,
        "dcterms.modified": lastModified,
        bingbot:
            "index, nofollow, noarchive, notranslate, max-video-preview:-1, max-image-preview:standard, max-snippet:-1",
        robots: "noimageai, noai"
    },
    appLinks: {
        web: {
            url: siteConfig.url,
            should_fallback: true
        }
    },
    verification: {
        google: siteConfig.analytics.googleVerification,
        yandex: siteConfig.analytics.yandexVerification,
        other: {
            me: [siteConfig.email.work, siteConfig.url]
        }
    },
    openGraph: {
        title: title,
        description: description,
        type: "website",
        url: siteConfig.url,
        siteName: siteConfig.domain,
        locale: "vi_VN"
    },
    twitter: {
        card: "summary_large_image",
        title: title,
        description: description
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: false,
            noarchive: true,
            notranslate: true,
            nositelinkssearchbox: false,
            "max-video-preview": -1,
            "max-image-preview": "standard",
            "max-snippet": -1
        }
    },
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png"
    }
}

export const viewport: Viewport = {
    width: "device-width",
    height: "device-height",
    initialScale: 1,
    viewportFit: "cover",
    minimumScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ebecee" },
        { media: "(prefers-color-scheme: dark)", color: "#17191c" }
    ],
    colorScheme: "dark light"
}

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["500", "700", "800"],
    display: "swap",
    variable: "--font-plus-jakarta-sans"
})

const sfMono = localFont({
    src: "../../public/fonts/SFMono.woff2",
    display: "swap",
    variable: "--font-sf-mono"
})

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(plusJakartaSans.variable, sfMono.variable)}
        >
            <body
                className={cn(`
                    text-muted-foreground bg-background flex
                    bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]
                    bg-size-[10px_10px] bg-fixed px-(--padding) -tracking-[.04em]
                `)}
            >
                <ThemeProvider disableTransitionOnChange>
                    <MarginLine />
                    {children}
                    <MarginLine />
                    <ModeToggle />
                </ThemeProvider>
            </body>
        </html>
    )
}
