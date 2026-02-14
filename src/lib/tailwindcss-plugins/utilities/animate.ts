import plugin from "tailwindcss/plugin"
import { type PluginAPI } from "tailwindcss/types/config"

function filterDefault(theme: PluginAPI["theme"]) {
    return Object.fromEntries(
        Object.entries(theme).filter(([key]) => key !== "DEFAULT")
    )
}

export default plugin(
    function ({ addUtilities, matchUtilities, theme }) {
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
            { values: theme("animationOpacity") }
        )

        matchUtilities(
            {
                "zoom-in": (value: string) => ({ "--tw-enter-scale": value }),
                "zoom-out": (value: string) => ({ "--tw-exit-scale": value })
            },
            { values: theme("animationScale") }
        )

        matchUtilities(
            {
                "spin-in": (value: string) => ({ "--tw-enter-rotate": value }),
                "spin-out": (value: string) => ({ "--tw-exit-rotate": value })
            },
            { values: theme("animationRotate") }
        )

        matchUtilities(
            {
                "blur-in": (value: string) => ({ "--tw-enter-blur": value }),
                "blur-out": (value: string) => ({ "--tw-exit-blur": value })
            },
            { values: theme("animationBlur") }
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
            { values: theme("animationTranslate") }
        )

        matchUtilities(
            {
                "animation-duration": (value: string) => ({
                    animationDuration: value
                })
            },
            { values: filterDefault(theme("animationDuration")) }
        )

        matchUtilities(
            {
                "animation-delay": (value: string) => ({
                    animationDelay: value
                })
            },
            { values: theme("animationDelay") }
        )

        matchUtilities(
            {
                "animation-ease": (value: string) => ({
                    animationTimingFunction: value
                })
            },
            { values: filterDefault(theme("animationTimingFunction")) }
        )

        matchUtilities(
            { animation: (value: string) => ({ animationPlayState: value }) },
            { values: theme("animationPlayState") }
        )

        matchUtilities(
            { "fill-mode": (value: string) => ({ animationFillMode: value }) },
            { values: theme("animationFillMode") }
        )

        matchUtilities(
            { direction: (value: string) => ({ animationDirection: value }) },
            { values: theme("animationDirection") }
        )

        matchUtilities(
            { repeat: (value: string) => ({ animationIterationCount: value }) },
            { values: theme("animationRepeat") }
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
