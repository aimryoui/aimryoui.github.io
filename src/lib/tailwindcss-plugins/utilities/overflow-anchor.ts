import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                "overflow-anchor": (value: string) => ({
                    overflowAnchor: value
                })
            },
            { values: theme("overflowAnchor") }
        )
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-anchor} */
            overflowAnchor: {
                auto: "auto",
                none: "none"
            }
        }
    }
)
