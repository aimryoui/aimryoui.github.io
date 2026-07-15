import plugin from "tailwindcss/plugin"

export default plugin(
    ({ addBase, matchUtilities, theme }) => {
        addBase({
            ":root": {
                "--default-transition-timing-function": theme(
                    "transitionTimingFunction.default"
                ),
                "--default-transition-duration": theme("transitionDuration.150")
            }
        })
        addBase({
            "@property --tw-duration": {
                syntax: "'*'",
                inherits: "false"
            }
        })
        addBase({
            "@property --tw-ease": {
                syntax: "'*'",
                inherits: "false"
            }
        })
        matchUtilities(
            {
                transition: (value: string) => ({
                    "transition-property": value,
                    "transition-timing-function":
                        "var(--tw-ease, var(--default-transition-timing-function))",
                    "transition-duration":
                        "var(--tw-duration, var(--default-transition-duration))"
                })
            },
            {
                values: theme("transitionProperty"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-property#formal_syntax} */
                type: ["any"]
            }
        )
        matchUtilities(
            {
                ease: (value: string) => ({
                    "--tw-ease": value,
                    "transition-timing-function": value
                })
            },
            {
                values: theme("transitionTimingFunction"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-timing-function#formal_syntax} */
                // type: ["easing-function"]
                type: ["any"]
            }
        )
        matchUtilities(
            {
                duration: (value: string) => ({
                    "--tw-duration": value,
                    "transition-duration": value
                })
            },
            {
                values: theme("transitionDuration"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-duration#formal_syntax} */
                // type: ["time"]
                type: ["any"]
            }
        )
        matchUtilities(
            {
                delay: (value: string) => ({
                    "transition-delay": value
                })
            },
            {
                values: theme("transitionDelay"),
                // type: ["time"]
                type: ["any"]
            }
        )
    },
    {
        corePlugins: {
            transitionProperty: false,
            transitionDelay: false,
            transitionDuration: false,
            transitionTimingFunction: false
        },
        theme: {
            /** @see {@link https://tailwindcss.com/docs/transition-property} */
            transitionProperty: {
                DEFAULT:
                    "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
                all: "all",
                colors: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
                opacity: "opacity",
                shadow: "box-shadow",
                transform: "transform, translate, scale, rotate",
                none: "none"
            },
            /** @see {@link https://tailwindcss.com/docs/transition-timing-function} */
            transitionTimingFunction: {
                default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                linear: "linear",
                in: "cubic-bezier(0.4, 0, 1, 1)",
                out: "cubic-bezier(0, 0, 0.2, 1)",
                "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
                "swift-out": "cubic-bezier(0.4, 0.2, 0, 1)",
                "sine-in": "cubic-bezier(0.45, 0, 1, 1)",
                "sine-out": "cubic-bezier(0, 0, 0.55, 1)",
                "sine-in-out": "cubic-bezier(0.45, 0, 0.55, 1)",
                "quad-in": "cubic-bezier(0.43, 0, 0.82, 0.60)",
                "quad-out": "cubic-bezier(0.18, 0.4, 0.57, 1)",
                "quad-in-out": "cubic-bezier(0.43, 0, 0.57, 1)",
                "cubic-in": "cubic-bezier(0.67, 0, 0.84, 0.54)",
                "cubic-out": "cubic-bezier(0.16, 0.46, 0.33, 1)",
                "cubic-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
                "quart-in": "cubic-bezier(0.81, 0, 0.77, 0.34)",
                "quart-out": "cubic-bezier(0.23, 0.66, 0.19, 1)",
                "quart-in-out": "cubic-bezier(0.81, 0, 0.19, 1)",
                "quint-in": "cubic-bezier(0.89, 0, 0.81, 0.27)",
                "quint-out": "cubic-bezier(0.19, 0.73, 0.11, 1)",
                "quint-in-out": "cubic-bezier(0.9, 0, 0.1, 1)",
                "expo-in": "cubic-bezier(1.04, 0, 0.88, 0.49)",
                "expo-out": "cubic-bezier(0.12, 0.51, -0.4, 1)",
                "expo-in-out": "cubic-bezier(0.95, 0, 0.05, 1)",
                "circ-in": "cubic-bezier(0.6, 0, 1, 0.45)",
                "circ-out": "cubic-bezier(1, 0.55, 0.4, 1)",
                "circ-in-out": "cubic-bezier(0.82, 0, 0.18, 1)",
                "back-in": "cubic-bezier(0.77, -0.63, 1, 1)",
                "back-out": "cubic-bezier(0, 0, 0.23, 1.37)",
                "back-in-out": "cubic-bezier(0.77, -0.63, 0.23, 1.37)",
                initial: "initial"
            },
            transitionDuration: {
                0: "0s",
                75: "75ms",
                100: ".1s",
                150: ".15s",
                200: ".2s",
                300: ".3s",
                500: ".5s",
                550: ".55s",
                700: ".7s",
                800: ".8s",
                1000: "1s"
            },
            transitionDelay: ({ theme }) => ({
                ...(theme("transitionDuration") as Record<string, string>)
            })
        }
    }
)
