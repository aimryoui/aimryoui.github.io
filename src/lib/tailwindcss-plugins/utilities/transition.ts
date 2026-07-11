import plugin from "tailwindcss/plugin"

export default plugin(
    ({ addBase, matchUtilities, theme }) => {
        addBase({
            ":root": {
                "--default-transition-timing-function": theme(
                    "transitionTimingFunction.ease-in-out"
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
                linear: "linear",
                in: "cubic-bezier(0.4, 0, 1, 1)",
                out: "cubic-bezier(0, 0, 0.2, 1)",
                "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
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
