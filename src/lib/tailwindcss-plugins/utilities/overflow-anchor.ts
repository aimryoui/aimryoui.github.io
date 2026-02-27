import plugin from "tailwindcss/plugin"

export default plugin(
    ({ matchUtilities, theme }) => {
        matchUtilities(
            {
                "overflow-anchor": (value: string) => ({
                    overflowAnchor: value
                })
            },
            {
                values: theme("overflowAnchor"),
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-anchor#formal_syntax} */
                type: ["lookup"]
            }
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
