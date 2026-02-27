import plugin from "tailwindcss/plugin"
import { type PluginAPI } from "tailwindcss/types/config"

function filterDefault(theme: PluginAPI["theme"]) {
    return Object.fromEntries(
        Object.entries(theme).filter(([key]) => key !== "DEFAULT")
    )
}

export default plugin(
    ({ addUtilities, matchUtilities, theme }) => {
        addUtilities({
            "@keyframes enter": theme("keyframes.enter"),
            "@keyframes exit": theme("keyframes.exit"),
            ".animate-in": {
                animationName: "enter",
                animationDuration: theme("animationDuration.DEFAULT"),
                "--tw-enter-opacity": "initial",
                "--tw-enter-scale": "initial",
                "--tw-enter-rotate": "initial",
                "--tw-enter-translate-x": "initial",
                "--tw-enter-translate-y": "initial",
                "--tw-enter-blur": "initial"
            },
            ".animate-out": {
                animationName: "exit",
                animationDuration: theme("animationDuration.DEFAULT"),
                "--tw-exit-opacity": "initial",
                "--tw-exit-scale": "initial",
                "--tw-exit-rotate": "initial",
                "--tw-exit-translate-x": "initial",
                "--tw-exit-translate-y": "initial",
                "--tw-exit-blur": "initial"
            }
        })

        matchUtilities(
            {
                "fade-in": (value: string) => ({ "--tw-enter-opacity": value }),
                "fade-out": (value: string) => ({ "--tw-exit-opacity": value })
            },
            {
                values: theme("animationOpacity"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/opacity#formal_syntax} */
                type: ["percentage", "number"]
            }
        )

        matchUtilities(
            {
                "zoom-in": (value: string) => ({ "--tw-enter-scale": value }),
                "zoom-out": (value: string) => ({ "--tw-exit-scale": value })
            },
            {
                values: theme("animationScale"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function/scale#formal_syntax} */
                type: ["percentage", "number"]
            }
        )

        matchUtilities(
            {
                "spin-in": (value: string) => ({ "--tw-enter-rotate": value }),
                "spin-out": (value: string) => ({ "--tw-exit-rotate": value })
            },
            {
                values: theme("animationRotate")
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function/rotate#formal_syntax} */
                // type: ["angle", "zero"]
            }
        )

        matchUtilities(
            {
                "blur-in": (value: string) => ({ "--tw-enter-blur": value }),
                "blur-out": (value: string) => ({ "--tw-exit-blur": value })
            },
            {
                values: theme("animationBlur"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/filter-function/blur#parameters} */
                type: ["length", "percentage", "number"]
            }
        )

        matchUtilities(
            {
                "slide-in-from-top": (value: string) => ({
                    "--tw-enter-translate-y": `-${value}`
                }),
                "slide-in-from-bottom": (value) => ({
                    "--tw-enter-translate-y": value
                }),
                "slide-in-from-left": (value) => ({
                    "--tw-enter-translate-x": `-${value}`
                }),
                "slide-in-from-right": (value) => ({
                    "--tw-enter-translate-x": value
                }),
                "slide-out-to-top": (value) => ({
                    "--tw-exit-translate-y": `-${value}`
                }),
                "slide-out-to-bottom": (value) => ({
                    "--tw-exit-translate-y": value
                }),
                "slide-out-to-left": (value) => ({
                    "--tw-exit-translate-x": `-${value}`
                }),
                "slide-out-to-right": (value) => ({
                    "--tw-exit-translate-x": value
                })
            },
            {
                values: theme("animationTranslate"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function/translate#formal_syntax} */
                type: ["length", "percentage"]
            }
        )

        matchUtilities(
            {
                "animation-duration": (value: string) => ({
                    animationDuration: value
                })
            },
            {
                values: filterDefault(theme("animationDuration")),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-duration#formal_syntax} */
                // type: ["time"]
                type: ["any"]
            }
        )

        matchUtilities(
            {
                "animation-delay": (value: string) => ({
                    animationDelay: value
                })
            },
            {
                values: theme("animationDelay"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-delay#formal_syntax} */
                // type: ["time"]
                type: ["any"]
            }
        )

        matchUtilities(
            {
                "animation-ease": (value: string) => ({
                    animationTimingFunction: value
                })
            },
            {
                values: filterDefault(theme("animationTimingFunction")),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timing-function#formal_syntax} */
                // type: ["easing-function"]
                type: ["any"]
            }
        )

        matchUtilities(
            { animation: (value: string) => ({ animationPlayState: value }) },
            {
                values: theme("animationPlayState"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-play-state#formal_syntax} */
                // type: ["single-animation-play-state"]
                type: ["lookup"]
            }
        )

        matchUtilities(
            { "fill-mode": (value: string) => ({ animationFillMode: value }) },
            {
                values: theme("animationFillMode"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-fill-mode#formal_syntax} */
                // type: ["single-animation-fill-mode"]
                type: ["lookup"]
            }
        )

        matchUtilities(
            { direction: (value: string) => ({ animationDirection: value }) },
            {
                values: theme("animationDirection"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-direction#formal_syntax} */
                // type: ["animation-direction"]
                type: ["lookup"]
            }
        )

        matchUtilities(
            { repeat: (value: string) => ({ animationIterationCount: value }) },
            {
                values: theme("animationRepeat"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-iteration-count#formal_syntax} */
                type: ["number"]
            }
        )
    },
    {
        theme: {
            extend: {
                animationDelay: ({ theme }: { theme: PluginAPI["theme"] }) => ({
                    ...theme("transitionDelay")
                }),
                animationDuration: ({
                    theme
                }: {
                    theme: PluginAPI["theme"]
                }) => ({
                    0: "0ms",
                    ...theme("transitionDuration")
                }),
                animationTimingFunction: ({
                    theme
                }: {
                    theme: PluginAPI["theme"]
                }) => ({
                    ...theme("transitionTimingFunction")
                }),
                animationPlayState: {
                    running: "running",
                    paused: "paused"
                },
                animationFillMode: {
                    none: "none",
                    forwards: "forwards",
                    backwards: "backwards",
                    both: "both"
                },
                animationDirection: {
                    normal: "normal",
                    reverse: "reverse",
                    alternate: "alternate",
                    "alternate-reverse": "alternate-reverse"
                },
                animationOpacity: ({
                    theme
                }: {
                    theme: PluginAPI["theme"]
                }) => ({
                    DEFAULT: 0,
                    ...theme("opacity")
                }),
                animationTranslate: ({
                    theme
                }: {
                    theme: PluginAPI["theme"]
                }) => ({
                    DEFAULT: "100%",
                    ...theme("translate")
                }),
                animationScale: ({ theme }: { theme: PluginAPI["theme"] }) => ({
                    DEFAULT: 0,
                    ...theme("scale")
                }),
                animationRotate: ({
                    theme
                }: {
                    theme: PluginAPI["theme"]
                }) => ({
                    DEFAULT: "30deg",
                    ...theme("rotate")
                }),
                animationBlur: ({ theme }: { theme: PluginAPI["theme"] }) => ({
                    DEFAULT: "0px",
                    ...theme("blur")
                }),
                animationRepeat: {
                    0: "0",
                    1: "1",
                    2: "2",
                    infinite: "infinite"
                },
                keyframes: {
                    enter: {
                        from: {
                            opacity: "var(--tw-enter-opacity, 1)",
                            filter: "blur(var(--tw-enter-blur, 0px))",
                            transform: /* css */ `
                            translate3d(
                                var(--tw-enter-translate-x, 0),
                                var(--tw-enter-translate-y, 0),
                                0
                            )
                            scale3d(
                                var(--tw-enter-scale, 1),
                                var(--tw-enter-scale, 1),
                                var(--tw-enter-scale, 1)
                            )
                            rotate(
                                var(--tw-enter-rotate, 0)
                            )
                        `
                        }
                    },
                    exit: {
                        to: {
                            opacity: "var(--tw-exit-opacity, 1)",
                            filter: "blur(var(--tw-exit-blur, 0px))",
                            transform: /* css */ `
                            translate3d(
                                var(--tw-exit-translate-x, 0),
                                var(--tw-exit-translate-y, 0),
                                0
                            )
                            scale3d(
                                var(--tw-exit-scale, 1),
                                var(--tw-exit-scale, 1),
                                var(--tw-exit-scale, 1)
                            )
                            rotate(
                                var(--tw-exit-rotate, 0)
                            )
                        `
                        }
                    }
                }
            }
        }
    }
)
