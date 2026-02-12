import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ addBase, addUtilities, matchUtilities, theme }) {
        addBase({
            "@property --tw-outline-style": {
                syntax: "'*'",
                inherits: "false",
                "initial-value": "solid"
            }
        })
        matchUtilities(
            {
                outline: (value: string) => ({
                    "--tw-outline-style": value,
                    outlineStyle: value
                })
            },
            { values: theme("outlineStyle") }
        )
        matchUtilities(
            {
                outline: (value: string) => ({
                    outlineStyle: "var(--tw-outline-style)",
                    outlineWidth: value
                })
            },
            { values: theme("outlineWidth") }
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
                    px: "var(--px)"
                }
            },
            outlineStyle: {
                solid: "solid",
                dashed: "dashed",
                dotted: "dotted",
                double: "double",
                none: "none"
            },
            /** @see {@link https://tailwindcss.com/docs/outline-width} */
            outlineWidth: {
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
