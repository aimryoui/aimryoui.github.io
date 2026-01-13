import "./globals.css"
import "lenis/dist/lenis.css"

import { type Metadata, type Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"

import { MarginLine } from "@/components/layout/line"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site.config"
import { cn } from "@/lib/utils"
import LenisProvider from "@/providers/lenis-provider"
import { ThemeProvider } from "@/providers/theme-provider"

import AppData from "../../package.json"

const lastModified = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Saigon"
})

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
                    <LenisProvider>
                        <MarginLine />
                        {children}
                        <MarginLine />
                        <ModeToggle />
                    </LenisProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
