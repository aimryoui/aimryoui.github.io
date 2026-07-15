// oxlint-disable @limegrass/import-alias/import-alias
import anchorsPlugin from "@toolwind/anchors"
import { type Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import { transformer } from "twg/transform"

import animate from "./src/lib/tailwindcss-plugins/utilities/animate"
import backfaceVisibility from "./src/lib/tailwindcss-plugins/utilities/backface-visibility"
import backgroundClip from "./src/lib/tailwindcss-plugins/utilities/background-clip"
import clipPath from "./src/lib/tailwindcss-plugins/utilities/clip-path"
import contentVisibility from "./src/lib/tailwindcss-plugins/utilities/content-visibility"
import cornerShape from "./src/lib/tailwindcss-plugins/utilities/corner-shape"
import displayGridLanes from "./src/lib/tailwindcss-plugins/utilities/display-grid-lanes"
import fieldSizing from "./src/lib/tailwindcss-plugins/utilities/field-sizing"
import fontVariationSettings from "./src/lib/tailwindcss-plugins/utilities/font-variation-settings"
import outline from "./src/lib/tailwindcss-plugins/utilities/outline"
import overflowAnchor from "./src/lib/tailwindcss-plugins/utilities/overflow-anchor"
import overflowWrap from "./src/lib/tailwindcss-plugins/utilities/overflow-wrap"
import scrollFade from "./src/lib/tailwindcss-plugins/utilities/scroll-fade"
import scrollbar from "./src/lib/tailwindcss-plugins/utilities/scrollbar"
import scrollbarGutter from "./src/lib/tailwindcss-plugins/utilities/scrollbar-gutter"
import transition from "./src/lib/tailwindcss-plugins/utilities/transition"
import transitionBehavior from "./src/lib/tailwindcss-plugins/utilities/transition-behavior"
import viewTransition from "./src/lib/tailwindcss-plugins/utilities/view-transition"
import all from "./src/lib/tailwindcss-plugins/variants/all"
import browserEngines from "./src/lib/tailwindcss-plugins/variants/browser-engines"
import containerQueries from "./src/lib/tailwindcss-plugins/variants/container-queries"
import has from "./src/lib/tailwindcss-plugins/variants/has"
import not from "./src/lib/tailwindcss-plugins/variants/not"
import nth from "./src/lib/tailwindcss-plugins/variants/nth"
import slotted from "./src/lib/tailwindcss-plugins/variants/slotted"

export const BASE_FONT_SIZE = 16

const colorMix = (variable: string) => {
    return `color-mix(in oklab, var(${variable}) calc(<alpha-value> * 100%), transparent)`
}

export default {
    content: {
        files: [
            "./src/app/**/*.{ts,tsx}",
            "./src/components/**/*.{ts,tsx}",
            "./src/content/**/*.mdx"
        ],
        transform: transformer({
            callee: "cn"
        })
    },
    future: {
        hoverOnlyWhenSupported: true
    },
    darkMode: ["variant", ["&:where([data-theme=dark], [data-theme=dark] *)"]],
    theme: {
        screens: {
            "2xl": { max: "96rem" },
            xl: { max: "80rem" },
            lg: { max: "72rem" },
            md: { max: "48rem" },
            sm: { max: "40rem" }
        },
        fontFamily: {
            sans: [
                "var(--font-google-sans-flex)",
                "ui-sans-serif",
                "system-ui"
            ],
            mono: ["var(--font-sf-mono)", "ui-monospace"]
        },
        fontWeight: {},
        extend: {
            fontSize: {
                xxs: ".5rem",
                sm: [".875rem", "1.3"],
                md: [".9375rem", "1.3"],
                base: ["1rem", "1.3"],
                "2xl": ["1.5rem", "1.3"],
                "4xl": ["2.25rem", "1.3"]
            },
            spacing: {
                px: "var(--px)",
                0.75: ".1875rem",
                1.25: ".3125rem",
                2.25: ".5625rem",
                3.25: ".8125rem",
                3.75: ".9375rem",
                4.5: "1.125rem",
                5.5: "1.375rem",
                5.25: "1.3125rem",
                6.5: "1.75rem",
                7.5: "1.875rem",
                9.5: "2.375rem",
                11.5: "2.875rem",
                13: "3.25rem",
                16.5: "4.125rem",
                18: "4.5rem",
                22: "5.5rem",
                25: "6.25rem",
                37.5: "9.375rem",
                56.25: "14.0625rem",
                61.25: "15.3125rem",
                75: "18.75rem",
                sidebar: "26.25rem",
                120: "30rem",
                125: "31.25rem",
                200: "50rem",
                375: "93.75rem",
                700: "175rem",
                auto: "auto",
                inherit: "inherit",
                unset: "unset"
            },
            inset: ({ theme }) => ({
                ...(theme("spacing") as Record<string, string>)
            }),
            rotate: {
                360: "360deg"
            },
            transitionDuration: {
                50: "50ms",
                250: ".25s",
                400: ".4s"
            },
            transitionTimingFunction: {
                spring: "cubic-bezier(0.22, 1, 0.36, 1)"
            },
            borderRadius: {
                xs: "var(--radius-xs)",
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
                "3xl": "var(--radius-3xl)",
                media: "var(--radius-media)",
                inherit: "inherit"
            },
            borderWidth: {
                DEFAULT: "var(--px)",
                0: "0",
                2: ".125rem",
                3: ".1875rem",
                6: ".375rem",
                media: "calc(var(--px) / var(--nhn-wrap-scale, 1))"
            },
            ringWidth: {
                DEFAULT: "var(--px)"
            },
            backdropBlur: {
                xs: "4px",
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "40px",
                "3xl": "64px"
            },
            aspectRatio: {
                "3/2": "3/2",
                3: "3"
            },
            zIndex: {
                1: "1",
                2: "2",
                infinite: "2147483647"
            },
            data: {
                open: "open",
                closed: "closed",
                "popup-open": "popup-open",
                "popup-closed": "popup-closed",
                current: "current",
                previous: "previous",
                instant: "instant",
                "starting-style": "starting-style",
                "ending-style": "ending-style",
                inset: "inset",
                disabled: "disabled",
                horizontal: "orientation=horizontal",
                vertical: "orientation=vertical"
            },
            opacity: {
                8: ".08"
            },
            animation: {
                spinner: "spinner",
                focus: ".2s ease-out focus forwards",
                inert: "inert forwards",
                "nav-reveal": "nav-reveal 1s cubic-bezier(.4,0,.6,1) forwards"
            },
            keyframes: ({ theme }) => ({
                spinner: {
                    "0%": {
                        opacity: "1"
                    },
                    "100%": {
                        opacity: ".15"
                    }
                },
                focus: {
                    "0%": {
                        outlineWidth: theme("outlineWidth.40") as string,
                        outlineColor: "transparent"
                    },
                    "100%": {
                        outlineWidth: theme("outlineWidth.4") as string,
                        outlineColor: theme("colors.highlighted/0.3") as string
                    }
                },
                inert: {
                    "0%": {
                        pointerEvent: "none"
                    },
                    "100%": {
                        pointerEvent: "auto"
                    }
                },
                "nav-reveal": {
                    "0%": {
                        maskPosition: "0 100%"
                    },
                    "100%": {
                        maskPosition: "0 0"
                    }
                }
            })
        },
        colors: {
            transparent: "transparent",
            current:
                "color-mix(in oklab, currentColor calc(<alpha-value> * 100%), transparent)",
            white: colorMix("--color-white"),
            black: colorMix("--color-black"),
            default: colorMix("--color-default"),
            inverted: colorMix("--color-inverted"),
            alert: colorMix("--color-alert"),

            background: colorMix("--color-background"),
            foreground: colorMix("--color-foreground"),
            card: {
                DEFAULT: colorMix("--color-card"),
                foreground: colorMix("--color-card-foreground")
            },
            popover: {
                DEFAULT: colorMix("--color-popover"),
                foreground: colorMix("--color-popover-foreground")
            },
            primary: {
                DEFAULT: colorMix("--color-primary"),
                foreground: colorMix("--color-primary-foreground")
            },
            secondary: {
                DEFAULT: colorMix("--color-secondary"),
                foreground: colorMix("--color-secondary-foreground")
            },
            muted: {
                DEFAULT: colorMix("--color-muted"),
                foreground: colorMix("--color-muted-foreground")
            },
            accent: {
                DEFAULT: colorMix("--color-accent"),
                foreground: colorMix("--color-accent-foreground")
            },
            destructive: {
                DEFAULT: colorMix("--color-destructive"),
                foreground: colorMix("--color-destructive-foreground")
            },
            border: colorMix("--color-border"),
            "svg-filter": colorMix("--color-svg-filter"),
            input: colorMix("--color-input"),
            ring: colorMix("--color-ring"),
            chart: {
                1: colorMix("--color-chart-1"),
                2: colorMix("--color-chart-2"),
                3: colorMix("--color-chart-3"),
                4: colorMix("--color-chart-4"),
                5: colorMix("--color-chart-5")
            },

            highlighted: colorMix("--color-highlighted"),
            pattern: colorMix("--color-pattern"),
            stroke: colorMix("--color-stroke"),

            "element-hover": "var(--color-element-hover)"
        }
    },
    plugins: [
        anchorsPlugin,

        animate,
        backfaceVisibility,
        backgroundClip,
        clipPath,
        contentVisibility,
        cornerShape,
        displayGridLanes,
        fieldSizing,
        fontVariationSettings,
        outline,
        overflowAnchor,
        overflowWrap,
        scrollFade,
        scrollbar,
        scrollbarGutter,
        transition,
        transitionBehavior,
        viewTransition,

        all,
        browserEngines,
        containerQueries,
        has,
        not,
        nth,
        slotted,

        plugin(({ addBase, addVariant }) => {
            addBase({
                ":root": {
                    "--spacing": `${(4 / BASE_FONT_SIZE).toString()}rem` // 0.25rem ~ 4px
                }
            })
            addVariant("light", [
                "&:where([data-theme=light], [data-theme=light] *)"
            ])
            addVariant("mac", [
                "&:where([data-platform=mac], [data-platform=mac] *)"
            ])
            addVariant("win", [
                "&:where([data-platform=win], [data-platform=win] *)"
            ])
            addVariant("starting", ["@starting-style"])
        })
    ]
} satisfies Config
