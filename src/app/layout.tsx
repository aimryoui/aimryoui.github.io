import "@/globals.css"

import { type Metadata, type Viewport } from "next"
import { Google_Sans_Flex } from "next/font/google"
import localFont from "next/font/local"

import { GoogleAnalytics } from "@next/third-parties/google"

import { RouteProgressProvider } from "@/components/animations/route-progress"
import { SmoothScrolling } from "@/components/animations/smooth-scrolling"
import { TargetCursor } from "@/components/animations/target-cursor"
import { AudioProvider } from "@/components/audio/audio"
import { MarginLine } from "@/components/layout/line"
import {
    MetaBall,
    PngAntiBleed,
    PngBorder
} from "@/components/media/svg-filter"
import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteConfig } from "@/configs/site.config"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider"
import { PreferenceScripts } from "@/scripts/preferences"
import { QueryListener } from "@/stores/query-store"

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
            "index, max-video-preview:-1, max-image-preview:standard, max-snippet:-1",
        robots: "noimageai, noai",

        "msvalidate.01": siteConfig.analytics.bingVerification
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
        me: [siteConfig.email.work, APP_BASE_URL],
        other: {
            bing: siteConfig.analytics.bingVerification
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
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
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
    // themeColor: [
    //     { media: "(prefers-color-scheme: light)", color: "#ebecee" },
    //     { media: "(prefers-color-scheme: dark)", color: "#17191c" }
    // ],
    colorScheme: "light dark"
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
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={cn(
                googleSansFlex.variable,
                sfMono.variable,
                "group/html antialiased scrollbar-colored scrollbar-thumb-default/40 scrollbar-track-pattern",
                "[--safe-area-inset-top:32px]",
                "[--safe-area-inset-bottom:32px]",
                "[--safe-area-inset-left:72px]",
                "[--safe-area-inset-right:72px]"
            )}
        >
            <head>
                <PreferenceScripts />
            </head>
            <body
                className={cn(
                    "[--body-safe-zone-left:max(calc(var(--safe-area-inset-left)+var(--spacing-safe-zone)/2),var(--spacing-safe-zone))]",
                    "[--body-safe-zone-right:max(calc(var(--safe-area-inset-right)+var(--spacing-safe-zone)/2),var(--spacing-safe-zone))]",
                    "relative flex min-w-body bg-background text-muted-foreground scrollbar-gutter-stable",
                    "pl-[--body-safe-zone-left] pr-[--body-safe-zone-right]",
                    {
                        after: "pointer-events-none absolute inset-0 -z-1 bg-[repeating-linear-gradient(315deg,var(--color-pattern)_0,var(--color-pattern)_.0625rem,transparent_0,transparent_50%)] bg-[length:.625rem_.625rem]",
                        selection: "bg-highlighted/20 dark:bg-highlighted/30",
                        "lg:before":
                            "pointer-events-none absolute inset-x-0 top-0 z-40 h-space bg-gradient-to-b from-background to-transparent"
                    }
                )}
            >
                <QueryListener />
                <AudioProvider>
                    <ThemeProvider disableTransitionOnChange>
                        {/* <LazyMotionProvider> */}
                        <SmoothScrolling root />
                        <DirectionProvider>
                            <RouteProgressProvider>
                                <TooltipProvider>
                                    <MarginLine />
                                    <MarginLine className="order-last" />
                                    {children}
                                    <PngAntiBleed />
                                    <PngBorder />
                                    <MetaBall />
                                    <TargetCursor />
                                    <Toaster />
                                </TooltipProvider>
                            </RouteProgressProvider>
                        </DirectionProvider>
                        {/* </LazyMotionProvider> */}
                    </ThemeProvider>
                </AudioProvider>
            </body>
            <GoogleAnalytics gaId={siteConfig.analytics.googleAnalytics} />
        </html>
    )
}
