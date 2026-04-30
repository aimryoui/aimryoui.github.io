import plugin from "tailwindcss/plugin"

export default plugin(
    ({ addBase, addUtilities, matchUtilities, theme }) => {
        addBase({
            "@property --tw-outline-style": {
                syntax: "'*'",
                inherits: "false",
                initialValue: "solid"
            }
        })
        matchUtilities(
            {
                outline: (value: string) => ({
                    "--tw-outline-style": value,
                    outlineStyle: value
                })
            },
            {
                values: theme("outlineStyle"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline-style#formal_syntax} */
                type: ["lookup"]
            }
        )
        matchUtilities(
            {
                outline: (value: string) => ({
                    outlineStyle: "var(--tw-outline-style)",
                    outlineWidth: value
                })
            },
            {
                values: theme("outlineWidth"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline-width#formal_syntax} */
                type: ["length"]
            }
        )
        addUtilities({
            ".outline-hidden": {
                outline: "2px solid transparent",
                "outline-offset": "2px"
            }
        })
    },
    {
        corePlugins: {
            outlineStyle: false,
            outlineWidth: false
        },
        theme: {
            extend: {
                outlineOffset: {
                    0: "0",
                    px: "var(--px)",
                    1: "var(--px)",
                    2: "125rem",
                    3: "1875rem",
                    4: "25rem",
                    8: "5rem",
                    40: "2.5rem"
                }
            },
            outlineStyle: {
                solid: "solid",
                dashed: "dashed",
                dotted: "dotted",
                double: "double",
                none: "none"
            },
            /**
             * @see {@link https://tailwindcss.com/docs/outline-width}
             * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline-width#formal_syntax}
             */
            outlineWidth: {
                thin: "thin",
                medium: "medium",
                thick: "thick",
                DEFAULT: "var(--px)",
                0: "0",
                1: "var(--px)",
                2: "0.125rem",
                3: "0.1875rem",
                4: "0.25rem",
                8: "0.5rem",
                40: "2.5rem"
            }
        }
    }
)
