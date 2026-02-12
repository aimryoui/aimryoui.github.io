import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                "field-sizing": (value: string) => ({
                    fieldSizing: value
                })
            },
            { values: theme("fieldSizing") }
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
