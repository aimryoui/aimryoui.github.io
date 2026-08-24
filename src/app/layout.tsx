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
import { DEFAULT_EFFECTS_PREFERENCES } from "@/configs/effects.config"
import { DEFAULT_MEDIA_PREFERENCES } from "@/configs/media.config"
import { siteConfig } from "@/configs/site.config"
import { minifyJs } from "@/helpers/minify-js"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider"
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

export default async function RootLayout({
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
                "group/html antialiased scrollbar-colored scrollbar-thumb-default/40 scrollbar-track-pattern"
            )}
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: await minifyJs(/* js */ `
                        const htmlElement = document.documentElement
                        // Platform detection
                        htmlElement.setAttribute("data-platform",
                            window.navigator.platform.includes("Mac")
                            ? "mac"
                            : "win"
                        )
                        // Motion preference
                        try {
                            const motionPref = localStorage.getItem("nhn-motion-preference")
                            if (motionPref) {
                                const parsed = JSON.parse(motionPref)
                                htmlElement.setAttribute("data-motion", parsed.state.preference)
                            } else {
                                htmlElement.setAttribute("data-motion", "system")
                            }
                        } catch (e) {
                            console.error("Error getting motion preference:", e)
                            htmlElement.setAttribute("data-motion", "system")
                        }
                        // Effects preferences
                        try {
                            const defaultEffectsString = ${DEFAULT_EFFECTS_PREFERENCES.length > 0 ? `"${DEFAULT_EFFECTS_PREFERENCES.join(" ")}"` : '"null"'}
                            const effectsPreference = localStorage.getItem("nhn-effects-preference")
                            if (effectsPreference) {
                                const parsed = JSON.parse(effectsPreference)
                                const effects = parsed.state.effects
                                htmlElement.setAttribute(
                                    "data-effects",
                                    effects.length > 0 ? effects.join(" ") : "null"
                                )
                            } else {
                                htmlElement.setAttribute("data-effects", defaultEffectsString)
                            }
                        } catch (e) {
                            console.error("Error getting effects preference:", e)
                            htmlElement.setAttribute("data-effects", ${DEFAULT_EFFECTS_PREFERENCES.length > 0 ? `"${DEFAULT_EFFECTS_PREFERENCES.join(" ")}"` : '"null"'})
                        }
                        // Media preferences
                        try {
                            const defaultMediaString = ${DEFAULT_MEDIA_PREFERENCES.length > 0 ? `"${DEFAULT_MEDIA_PREFERENCES.join(" ")}"` : '"null"'}
                            const mediaPreferences = localStorage.getItem("nhn-media-preferences")
                            if (mediaPreferences) {
                                const parsed = JSON.parse(mediaPreferences)
                                const prefs = parsed.state.preferences
                                htmlElement.setAttribute(
                                    "data-media",
                                    prefs.length > 0 ? prefs.join(" ") : "null"
                                )
                            } else {
                                htmlElement.setAttribute("data-media", defaultMediaString)
                            }
                        } catch (e) {
                            console.error("Error getting media preferences:", e)
                            htmlElement.setAttribute("data-media", ${DEFAULT_MEDIA_PREFERENCES.length > 0 ? `"${DEFAULT_MEDIA_PREFERENCES.join(" ")}"` : '"null"'})
                        }
                        // Navigation bar position
                        try {
                            const sidebarPosition = localStorage.getItem("nhn-sidebar-position")
                            const toolbarPosition = localStorage.getItem("nhn-toolbar-position")
                            if (sidebarPosition) {
                                const parsed = JSON.parse(sidebarPosition)
                                let position = parsed.state.position
                                if (position === "left") position = "inline-start"
                                if (position === "right") position = "inline-end"
                                htmlElement.setAttribute(
                                    "data-sidebar-position",
                                    position
                                )
                            } else {
                                htmlElement.setAttribute(
                                    "data-sidebar-position",
                                    "inline-start"
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
                            htmlElement.setAttribute("data-sidebar-position", "inline-start")
                            htmlElement.setAttribute("data-toolbar-position", "bottom")
                        }
                        // Direction preference
                        try {
                            const directionPref = localStorage.getItem("nhn-direction-preference")
                            let pref = "auto"
                            if (directionPref) {
                                const parsed = JSON.parse(directionPref)
                                if (parsed.state.preference !== "auto") { pref = parsed.state.preference }
                            }
                            if (pref === "rtl") {
                                htmlElement.dir = "rtl"
                            } else if (pref === "ltr") {
                                htmlElement.dir = "ltr"
                            } else {
                                // auto
                                const loc = new Intl.Locale(navigator.language)
                                const dir = loc.textInfo?.direction || (["ar", "he", "fa", "ur", "ps", "syr", "dv", "ku"].includes(loc.language) ? "rtl" : "ltr")
                                htmlElement.dir = dir
                            }
                        } catch (e) {
                            console.error("Error getting direction preference:", e)
                            htmlElement.dir = "ltr"
                        }
                    `)
                    }}
                />
            </head>
            <body
                className={cn(
                    "relative flex min-w-body bg-background px-safe-zone text-muted-foreground scrollbar-gutter-stable",
                    {
                        after: "pointer-events-none absolute inset-0 -z-1 bg-[repeating-linear-gradient(315deg,var(--color-pattern)_0,var(--color-pattern)_.0625rem,transparent_0,transparent_50%)] bg-[length:.625rem_.625rem]",
                        selection: "bg-highlighted/20 dark:bg-highlighted/30",
                        "lg:before":
                            "pointer-events-none absolute start-1/2 top-0 z-40 h-space w-screen -translate-x-1/2 bg-gradient-to-b from-background to-transparent rtl:translate-x-1/2"
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
