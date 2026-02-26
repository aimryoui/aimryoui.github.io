import "@/globals.css"

import { type Metadata, type Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"
import Script from "next/script"

import { MarginLine } from "@/components/layout/line"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteConfig } from "@/configs/site.config"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider"

import AppData from "~/package.json"

const lastModified = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Saigon"
})

const APP_NAME = AppData.name
const APP_DEFAULT_TITLE = "Personal Website | Nguyễn Hoàng Nhân"
// const APP_TITLE_TEMPLATE = "%s | Personal Website | Nguyễn Hoàng Nhân"
const APP_DESCRIPTION = AppData.description

const APP_BASE_URL = siteConfig.url
const APP_FULL_URL = siteConfig.fullUrl
const APP_BASE_PATH = ""

export const metadata: Metadata = {
    metadataBase: new URL(APP_BASE_URL),
    applicationName: APP_NAME,
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    generator: siteConfig.name,
    authors: [{ name: siteConfig.name }, { url: APP_BASE_URL }],
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
        "portfolio, project, artworks, designer, ui/ux, user interface, developer, artist, website",
    referrer: "origin-when-cross-origin",
    alternates: {
        canonical: APP_FULL_URL + APP_BASE_PATH
    },
    other: {
        language: "en",
        distribution: "global",
        rating: "general",
        "format-detection": "telephone=yes, address=no, email=yes",
        "identifier-URL": APP_FULL_URL,
        "reply-to": siteConfig.email.work,
        revised: lastModified,
        "dcterms.modified": lastModified,
        bingbot:
            "index, nofollow, noarchive, notranslate, max-video-preview:-1, max-image-preview:standard, max-snippet:-1",
        robots: "noimageai, noai"
    },
    appLinks: {
        web: {
            url: APP_FULL_URL,
            should_fallback: true
        }
    },
    verification: {
        google: siteConfig.analytics.googleVerification,
        yandex: siteConfig.analytics.yandexVerification,
        other: {
            me: [siteConfig.email.work, APP_BASE_URL]
        }
    },
    openGraph: {
        title: APP_DEFAULT_TITLE,
        description: APP_DESCRIPTION,
        type: "website",
        url: APP_FULL_URL + APP_BASE_PATH,
        siteName: siteConfig.domain,
        locale: "vi_VN"
    },
    twitter: {
        card: "summary_large_image",
        title: APP_DEFAULT_TITLE,
        description: APP_DESCRIPTION,
        site: APP_FULL_URL + APP_BASE_PATH
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
            dir="ltr"
            suppressHydrationWarning
            className={cn(
                plusJakartaSans.variable,
                sfMono.variable,
                "antialiased scrollbar-colored scrollbar-thumb-base-color/40 scrollbar-track-pattern"
            )}
            data-scroll-behavior="smooth"
        >
            <head>
                <Script id="platform-detection" strategy="beforeInteractive">
                    {`
                        document.documentElement.setAttribute("data-platform",
                            window.navigator.platform.includes("Mac")
                            ? "mac"
                            : "win"
                        )
                    `}
                </Script>
            </head>
            <body
                className={cn(
                    "relative flex bg-background px-6 -tracking-[.03em] text-muted-foreground",
                    // Fix tooltip viewport transition overflow bug
                    "overflow-x-hidden"
                )}
            >
                <ThemeProvider disableTransitionOnChange>
                    <TooltipProvider>
                        <div
                            className={cn(
                                "fixed inset-0 -z-50 h-full w-full",
                                "bg-[repeating-linear-gradient(315deg,var(--pattern)_0,var(--pattern)_.0625rem,transparent_0,transparent_50%)] bg-size-[.625rem_.625rem]"
                            )}
                        />
                        <MarginLine />
                        <MarginLine className="order-last" />
                        {children}
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
