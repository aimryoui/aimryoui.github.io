import plugin from "tailwindcss/plugin"

export default plugin(
    ({ matchUtilities, theme }) => {
        matchUtilities(
            {
                "scrollbar-gutter": (value: string) => ({
                    "scrollbar-gutter": value
                })
            },
            { values: theme("scrollbarGutter"), type: ["any"] }
        )
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter#formal_syntax} */
            scrollbarGutter: {
                auto: "auto",
                stable: "stable",
                both: "stable both-edges"
            }
        }
    }
)
