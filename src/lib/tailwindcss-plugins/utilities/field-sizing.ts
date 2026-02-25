import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                field: (value: string) => ({
                    fieldSizing: value
                })
            },
            {
                values: theme("fieldSizing"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing#formal_syntax} */
                type: ["lookup"]
            }
        )
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing} */
            fieldSizing: {
                content: "content",
                fixed: "fixed"
            }
        }
    }
)
