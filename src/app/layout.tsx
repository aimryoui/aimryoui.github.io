import "@/globals.css"

import { type Metadata, type Viewport } from "next"
import { Google_Sans_Flex } from "next/font/google"
import localFont from "next/font/local"

import { TargetCursor } from "@/components/animations/target-cursor"
import { MarginLine } from "@/components/layout/line"
import { PngAntiBleed, PngBorder } from "@/components/ui/svg-filter"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteConfig } from "@/configs/site.config"
import { cn } from "@/lib/utils"
import { LazyMotionProvider } from "@/providers/lazy-motion-provider"
import { ProgressProvider } from "@/providers/progress-provider"
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
    keywords: AppData.keywords,
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

const googleSansFlex = Google_Sans_Flex({
    subsets: ["latin", "vietnamese"],
    axes: ["slnt"],
    weight: "variable",
    display: "swap",
    variable: "--font-google-sans-flex"
})

const sfMono = localFont({
    src: "../../public/fonts/SFMono-Regular.woff2",
    weight: "400",
    style: "normal",
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
                googleSansFlex.variable,
                sfMono.variable,
                "group/html antialiased scrollbar-colored scrollbar-thumb-default/40 scrollbar-track-pattern"
            )}
            data-scroll-behavior="smooth"
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: /* js */ `
                        const htmlElement = document.documentElement
                        // Platform detection
                        htmlElement.setAttribute("data-platform",
                            window.navigator.platform.includes("Mac")
                            ? "mac"
                            : "win"
                        )
                        // Portfolio mode
                        try {
                            const portfolioMode = localStorage.getItem("portfolio-mode")
                            if (portfolioMode) {
                                const parsed = JSON.parse(portfolioMode)
                                htmlElement.setAttribute(
                                    "data-portfolio-mode",
                                    parsed.state.mode
                                )
                            } else {
                                htmlElement.setAttribute(
                                    "data-portfolio-mode",
                                    "pages"
                                )
                            }
                        } catch (e) {
                            console.error("Error getting portfolio mode:", e)
                            htmlElement.setAttribute("data-portfolio-mode", "pages")
                        }
                        // Navigation bar position
                        try {
                            const sidebarPosition = localStorage.getItem("sidebar-position")
                            const toolbarPosition = localStorage.getItem("toolbar-position")
                            if (sidebarPosition) {
                                const parsed = JSON.parse(sidebarPosition)
                                htmlElement.setAttribute(
                                    "data-sidebar-position",
                                    parsed.state.position
                                )
                            } else {
                                htmlElement.setAttribute(
                                    "data-sidebar-position",
                                    "left"
                                )
                            }
                            if (toolbarPosition) {
                                const parsed = JSON.parse(toolbarPosition)
                                htmlElement.setAttribute(
                                    "data-toolbar-position",
                                    parsed.state.position
                                )
                            } else {
                                htmlElement.setAttribute(
                                    "data-toolbar-position",
                                    "bottom"
                                )
                            }
                        } catch (e) {
                            console.error("Error getting navigation bar position:", e)
                            htmlElement.setAttribute("data-sidebar-position", "left")
                            htmlElement.setAttribute("data-toolbar-position", "bottom")
                        }
                    `
                    }}
                />
            </head>
            <body
                className={cn(
                    "relative flex bg-background px-6 text-muted-foreground scrollbar-gutter-stable",
                    // Fix tooltip viewport transition overflow bug
                    "overflow-x-hidden",
                    {
                        before: "absolute inset-0 -z-1 size-full bg-[repeating-linear-gradient(315deg,var(--color-pattern)_0,var(--color-pattern)_.0625rem,transparent_0,transparent_50%)] bg-[length:.625rem_.625rem]",
                        selection: "bg-highlighted/20 dark:bg-highlighted/30"
                    }
                )}
            >
                <ThemeProvider disableTransitionOnChange>
                    <LazyMotionProvider>
                        <ProgressProvider>
                            <TooltipProvider>
                                <TargetCursor />
                                <MarginLine />
                                <MarginLine className="order-last" />
                                {children}
                                <PngAntiBleed />
                                <PngBorder />
                            </TooltipProvider>
                        </ProgressProvider>
                    </LazyMotionProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
