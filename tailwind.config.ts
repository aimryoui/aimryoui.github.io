// oxlint-disable @limegrass/import-alias/import-alias
import anchorsPlugin from "@toolwind/anchors"
import { type Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import { transformer } from "twg/transform"

import animate from "./src/lib/tailwindcss-plugins/utilities/animate"
import backgroundClip from "./src/lib/tailwindcss-plugins/utilities/background-clip"
import backgroundPosition from "./src/lib/tailwindcss-plugins/utilities/background-position"
import backgroundSize from "./src/lib/tailwindcss-plugins/utilities/background-size"
import clipPath from "./src/lib/tailwindcss-plugins/utilities/clip-path"
import contentVisibility from "./src/lib/tailwindcss-plugins/utilities/content-visibility"
import cornerShape from "./src/lib/tailwindcss-plugins/utilities/corner-shape"
import displayGridLanes from "./src/lib/tailwindcss-plugins/utilities/display-grid-lanes"
import fieldSizing from "./src/lib/tailwindcss-plugins/utilities/field-sizing"
import outline from "./src/lib/tailwindcss-plugins/utilities/outline"
import overflowAnchor from "./src/lib/tailwindcss-plugins/utilities/overflow-anchor"
import scrollbar from "./src/lib/tailwindcss-plugins/utilities/scrollbar"
import transition from "./src/lib/tailwindcss-plugins/utilities/transition"
import transitionBehavior from "./src/lib/tailwindcss-plugins/utilities/transition-behavior"

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
            lg: { max: "64rem" },
            md: { max: "48rem" },
            sm: { max: "40rem" }
        },
        fontFamily: {
            sans: [
                "var(--font-plus-jakarta-sans)",
                "ui-sans-serif",
                "system-ui"
            ],
            mono: ["var(--font-sf-mono)", "ui-monospace"]
        },
        extend: {
            fontSize: {
                xxs: "0.5rem",
                base: ["1rem", "1.3"],
                "2xl": ["1.5rem", "1.3"],
                "4xl": ["2.25rem", "1.3"]
            },
            fontWeight: {
                normal: "500"
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
                11.5: "2.875rem",
                13: "3.25rem",
                16.5: "4.125rem",
                37.5: "9.375rem",
                56.25: "14.0625rem",
                61.25: "15.3125rem",
                75: "18.75rem",
                78: "19.5rem",
                120: "30rem",
                125: "31.25rem",
                200: "50rem",
                375: "93.75rem",
                700: "175rem",
                auto: "auto",
                inherit: "inherit",
                unset: "unset"
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
                inherit: "inherit"
            },
            borderWidth: {
                DEFAULT: "var(--px)",
                0: "0",
                2: ".125rem",
                3: ".1875rem",
                6: ".375rem"
            },
            aspectRatio: {
                3: "3"
            },
            zIndex: {
                1: "1",
                2: "2",
                infinite: "2147483647"
            },
            data: {
                instant: "instant",
                "starting-style": "starting-style",
                "ending-style": "ending-style"
            },
            opacity: {
                8: ".08"
            },
            animation: {
                spinner: "spinner",
                focus: ".2s ease-out focus forwards"
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
                }
            })
        },
        colors: {
            transparent: "transparent",
            current:
                "color-mix(in oklab, currentColor calc(<alpha-value> * 100%), transparent)",
            white: colorMix("--white"),
            black: colorMix("--black"),
            "base-color": colorMix("--base-color"),
            inverted: colorMix("--inverted"),
            alert: colorMix("--alert"),

            background: colorMix("--background"),
            foreground: colorMix("--foreground"),
            card: {
                DEFAULT: colorMix("--card"),
                foreground: colorMix("--card-foreground")
            },
            popover: {
                DEFAULT: colorMix("--popover"),
                foreground: colorMix("--popover-foreground")
            },
            primary: {
                DEFAULT: colorMix("--primary"),
                foreground: colorMix("--primary-foreground")
            },
            secondary: {
                DEFAULT: colorMix("--secondary"),
                foreground: colorMix("--secondary-foreground")
            },
            muted: {
                DEFAULT: colorMix("--muted"),
                foreground: colorMix("--muted-foreground")
            },
            accent: {
                DEFAULT: colorMix("--accent"),
                foreground: colorMix("--accent-foreground")
            },
            destructive: {
                DEFAULT: colorMix("--destructive"),
                foreground: colorMix("--destructive-foreground")
            },
            border: colorMix("--border"),
            input: colorMix("--input"),
            ring: colorMix("--ring"),
            chart: {
                "1": colorMix("--chart-1"),
                "2": colorMix("--chart-2"),
                "3": colorMix("--chart-3"),
                "4": colorMix("--chart-4"),
                "5": colorMix("--chart-5")
            },

            highlighted: colorMix("--highlighted"),
            pattern: colorMix("--pattern"),
            stroke: colorMix("--stroke"),

            "element-hover": "var(--element-hover)"
        }
    },
    plugins: [
        anchorsPlugin,

        animate,
        backgroundClip,
        backgroundPosition,
        backgroundSize,
        clipPath,
        contentVisibility,
        cornerShape,
        displayGridLanes,
        fieldSizing,
        outline,
        overflowAnchor,
        scrollbar,
        transition,
        transitionBehavior,

        plugin(function ({ addBase, addVariant }) {
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
