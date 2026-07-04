import plugin from "tailwindcss/plugin"

/**
 * Tailwind CSS v3 plugin — scroll-fade
 *
 * Port of shadcn/ui's `scroll-fade` Tailwind v4 CSS utility. Adds a mask-image
 * fade to the edges of a scroll container that tracks the scroll position via
 * CSS scroll-driven animations.
 *
 * @see {@link https://ui.shadcn.com/docs/utils/scroll-fade}
 */

/** Default fade depth: min(12%, 2.5rem ≈ 40px). */
const DEFAULT_FADE_SIZE = "min(12%, calc(var(--spacing) * 10))"

/**
 * The CSS variable chain each edge resolves through.
 *
 * @param {string} edge - The edge to get the size for.
 * @returns {string} The CSS variable for the given edge.
 */
const sizeVar = (edge: string) =>
    `var(--scroll-fade-${edge}-size, var(--scroll-fade-size, ${DEFAULT_FADE_SIZE}))`

/** Default reveal distance: 6rem ≈ 96px. */
const REVEAL = "var(--scroll-fade-reveal, calc(var(--spacing) * 24))"

// ---------------------------------------------------------------------------
// Shared style fragments
// ---------------------------------------------------------------------------

const maskCommon = {
    "mask-composite": "intersect",
    "mask-repeat": "no-repeat"
} as const

/**
 * Build the `@supports` block for scroll-driven animation on a given set of
 * directions. Returns two blocks: one for supporting browsers, one that
 * disables the effect entirely on browsers without scroll-driven animation
 * support (e.g. Safari < 26, Firefox) to avoid a permanently-on static mask
 * that looks broken.
 *
 * @param {string[]} animations - Animations to apply to the element.
 * @param {string[]} timelines - Timelines for the animations.
 * @param {string[]} ranges - Ranges for the animations.
 * @returns {Object} An object with `@supports` blocks for scroll-driven
 *   animation and a no-op fallback.
 */
function scrollAnimationBlock(
    animations: string[],
    timelines: string[],
    ranges: string[]
) {
    return {
        "@supports (animation-timeline: scroll())": {
            animation: animations.join(", "),
            "animation-timeline": timelines.join(", "),
            "animation-range": ranges.join(", "),
            "animation-fill-mode": "both"
        },
        "@supports not (animation-timeline: scroll())": {
            "--scroll-fade-mask": "none"
        }
    }
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export default plugin(
    ({ addBase, addUtilities, matchUtilities, theme }) => {
        // ---------------------------------------------------------------
        // 1. @property declarations (registered custom properties)
        // ---------------------------------------------------------------
        addBase({
            "@property --scroll-fade-t": {
                syntax: "'<length-percentage>'",
                inherits: "false",
                initialValue: "0px"
            },
            "@property --scroll-fade-b": {
                syntax: "'<length-percentage>'",
                inherits: "false",
                initialValue: "0px"
            },
            "@property --scroll-fade-s": {
                syntax: "'<length-percentage>'",
                inherits: "false",
                initialValue: "0px"
            },
            "@property --scroll-fade-e": {
                syntax: "'<length-percentage>'",
                inherits: "false",
                initialValue: "0px"
            },
            "@property --scroll-fade-mask": {
                syntax: "'*'",
                inherits: "false"
            }
        })

        // ---------------------------------------------------------------
        // 2. Keyframes
        // ---------------------------------------------------------------
        addUtilities({
            "@keyframes scroll-fade-reveal-t": theme(
                "keyframes.scroll-fade-reveal-t"
            ),
            "@keyframes scroll-fade-reveal-b": theme(
                "keyframes.scroll-fade-reveal-b"
            ),
            "@keyframes scroll-fade-reveal-s": theme(
                "keyframes.scroll-fade-reveal-s"
            ),
            "@keyframes scroll-fade-reveal-e": theme(
                "keyframes.scroll-fade-reveal-e"
            )
        })

        // ---------------------------------------------------------------
        // 3. Base utilities — scroll-fade / scroll-fade-y (vertical)
        // ---------------------------------------------------------------

        /**
         * Shared block-axis (vertical) styles used by both `.scroll-fade` and
         * `.scroll-fade-y`.
         */
        const verticalBase = {
            "--_scroll-fade-size-t": sizeVar("t"),
            "--_scroll-fade-size-b": sizeVar("b"),
            "--scroll-fade-block": `
            linear-gradient(
                to bottom, 
                transparent 0, 
                #000 var(--scroll-fade-t, 0px), 
                #000 calc(100% - var(--scroll-fade-b, 0px)), 
                transparent 100%
            )`,
            "mask-image": "var(--scroll-fade-mask, var(--scroll-fade-block))",
            ...maskCommon,
            ...scrollAnimationBlock(
                [
                    "scroll-fade-reveal-t 1ms ease-in-out",
                    "scroll-fade-reveal-b 1ms ease-in-out"
                ],
                ["scroll(self y)", "scroll(self y)"],
                [`0 ${REVEAL}`, `calc(100% - ${REVEAL}) 100%`]
            )
        }

        addUtilities({
            ".scroll-fade": verticalBase,
            ".scroll-fade-y": verticalBase,

            // ---------------------------------------------------------------
            // 4. scroll-fade-x (horizontal, RTL-aware)
            // ---------------------------------------------------------------
            ".scroll-fade-x": {
                "--_scroll-fade-size-s": sizeVar("s"),
                "--_scroll-fade-size-e": sizeVar("e"),
                "--scroll-fade-inline": `
                linear-gradient(
                    to right,
                    transparent 0,
                    #000 var(--scroll-fade-s, 0px),
                    #000 calc(100% - var(--scroll-fade-e, 0px)),
                    transparent 100%
                )`,
                "&:where([dir='rtl'], [dir='rtl'] *)": {
                    "--scroll-fade-inline": `
                    linear-gradient(
                        to left,
                        transparent 0,
                        #000 var(--scroll-fade-s, 0px),
                        #000 calc(100% - var(--scroll-fade-e, 0px)),
                        transparent 100%
                    )`
                },
                "mask-image":
                    "var(--scroll-fade-mask, var(--scroll-fade-inline))",
                ...maskCommon,
                ...scrollAnimationBlock(
                    [
                        "scroll-fade-reveal-s 1ms ease-in-out",
                        "scroll-fade-reveal-e 1ms ease-in-out"
                    ],
                    ["scroll(self inline)", "scroll(self inline)"],
                    [`0 ${REVEAL}`, `calc(100% - ${REVEAL}) 100%`]
                )
            },

            // ---------------------------------------------------------------
            // 5. Single-edge utilities
            // ---------------------------------------------------------------

            // Top
            ".scroll-fade-t": {
                "--_scroll-fade-size-t": sizeVar("t"),
                "--scroll-fade-mask": `
                linear-gradient(
                    to bottom,
                    transparent 0,
                    #000 var(--scroll-fade-t, 0px),
                    #000 100%
                )`,

                "mask-image": "var(--scroll-fade-mask)",
                ...maskCommon,
                ...scrollAnimationBlock(
                    ["scroll-fade-reveal-t 1ms ease-in-out"],
                    ["scroll(self y)"],
                    [`0 ${REVEAL}`]
                )
            },

            // Bottom
            ".scroll-fade-b": {
                "--_scroll-fade-size-b": sizeVar("b"),
                "--scroll-fade-mask": `
                linear-gradient(
                    to bottom,
                    #000 0,
                    #000 calc(100% - var(--scroll-fade-b, 0px)),
                    transparent 100%
                )`,

                "mask-image": "var(--scroll-fade-mask)",
                ...maskCommon,
                ...scrollAnimationBlock(
                    ["scroll-fade-reveal-b 1ms ease-in-out"],
                    ["scroll(self y)"],
                    [`calc(100% - ${REVEAL}) 100%`]
                )
            },

            // Left (physical)
            ".scroll-fade-l": {
                "--_scroll-fade-size-s": sizeVar("s"),
                "--scroll-fade-mask": `
                linear-gradient(
                    to right,
                    transparent 0,
                    #000 var(--scroll-fade-s, 0px),
                    #000 100%
                )`,

                "mask-image": "var(--scroll-fade-mask)",
                ...maskCommon,
                ...scrollAnimationBlock(
                    ["scroll-fade-reveal-s 1ms ease-in-out"],
                    ["scroll(self x)"],
                    [`0 ${REVEAL}`]
                )
            },

            // Right (physical)
            ".scroll-fade-r": {
                "--_scroll-fade-size-e": sizeVar("e"),
                "--scroll-fade-mask": `
                linear-gradient(
                    to right,
                    #000 0,
                    #000 calc(100% - var(--scroll-fade-e, 0px)),
                    transparent 100%
                )`,

                "mask-image": "var(--scroll-fade-mask)",
                ...maskCommon,
                ...scrollAnimationBlock(
                    ["scroll-fade-reveal-e 1ms ease-in-out"],
                    ["scroll(self x)"],
                    [`calc(100% - ${REVEAL}) 100%`]
                )
            },

            // Inline-start (logical, RTL-aware)
            ".scroll-fade-s": {
                "--_scroll-fade-size-s": sizeVar("s"),
                "--scroll-fade-mask": `
                linear-gradient(
                    to right,
                    transparent 0,
                    #000 var(--scroll-fade-s, 0px),
                    #000 100%
                )`,
                "&:where([dir='rtl'], [dir='rtl'] *)": {
                    "--scroll-fade-mask": `
                    linear-gradient(
                        to left,
                        transparent 0,
                        #000 var(--scroll-fade-s, 0px),
                        #000 100%
                    )`
                },
                "mask-image": "var(--scroll-fade-mask)",
                ...maskCommon,
                ...scrollAnimationBlock(
                    ["scroll-fade-reveal-s 1ms ease-in-out"],
                    ["scroll(self inline)"],
                    [`0 ${REVEAL}`]
                )
            },

            // Inline-end (logical, RTL-aware)
            ".scroll-fade-e": {
                "--_scroll-fade-size-e": sizeVar("e"),
                "--scroll-fade-mask": `
                linear-gradient(
                    to right,
                    #000 0,
                    #000 calc(100% - var(--scroll-fade-e, 0px)),
                    transparent 100%
                )`,
                "&:where([dir='rtl'], [dir='rtl'] *)": {
                    "--scroll-fade-mask": `
                    linear-gradient(
                        to left,
                        #000 0,
                        #000 calc(100% - var(--scroll-fade-e, 0px)),
                        transparent 100%
                    )`
                },
                "mask-image": "var(--scroll-fade-mask)",
                ...maskCommon,
                ...scrollAnimationBlock(
                    ["scroll-fade-reveal-e 1ms ease-in-out"],
                    ["scroll(self inline)"],
                    [`calc(100% - ${REVEAL}) 100%`]
                )
            },

            // ---------------------------------------------------------------
            // 6. scroll-fade-none — disable
            // ---------------------------------------------------------------
            ".scroll-fade-none": {
                "--scroll-fade-mask": "none"
            }
        })

        // ---------------------------------------------------------------
        // 7. Size modifiers via matchUtilities (scroll-fade-{n})
        // ---------------------------------------------------------------

        /** Spacing scale values for size modifiers. */
        const spacingValues = theme("spacing") as Record<string, string>

        // scroll-fade-{n} — global size override
        matchUtilities(
            {
                "scroll-fade": (value: string) => ({
                    "--scroll-fade-size": value
                })
            },
            {
                values: spacingValues,
                type: ["length", "percentage"]
            }
        )

        // Per-edge size overrides
        const edgeMap = {
            "scroll-fade-t": "--scroll-fade-t-size",
            "scroll-fade-b": "--scroll-fade-b-size",
            "scroll-fade-s": "--scroll-fade-s-size",
            "scroll-fade-e": "--scroll-fade-e-size"
        } as const

        for (const [utilityName, cssVar] of Object.entries(edgeMap)) {
            matchUtilities(
                {
                    [utilityName]: (value: string) => ({
                        [cssVar]: value
                    })
                },
                {
                    values: spacingValues,
                    type: ["length", "percentage"]
                }
            )
        }
    },
    {
        theme: {
            extend: {
                keyframes: {
                    "scroll-fade-reveal-t": {
                        from: { "--scroll-fade-t": "0px" },
                        to: {
                            "--scroll-fade-t": `var(--_scroll-fade-size-t, ${DEFAULT_FADE_SIZE})`
                        }
                    },
                    "scroll-fade-reveal-b": {
                        from: {
                            "--scroll-fade-b": `var(--_scroll-fade-size-b, ${DEFAULT_FADE_SIZE})`
                        },
                        to: { "--scroll-fade-b": "0px" }
                    },
                    "scroll-fade-reveal-s": {
                        from: { "--scroll-fade-s": "0px" },
                        to: {
                            "--scroll-fade-s": `var(--_scroll-fade-size-s, ${DEFAULT_FADE_SIZE})`
                        }
                    },
                    "scroll-fade-reveal-e": {
                        from: {
                            "--scroll-fade-e": `var(--_scroll-fade-size-e, ${DEFAULT_FADE_SIZE})`
                        },
                        to: { "--scroll-fade-e": "0px" }
                    }
                }
            }
        }
    }
)
