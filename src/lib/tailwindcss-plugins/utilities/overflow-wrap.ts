import plugin from "tailwindcss/plugin"

export default plugin(
    ({ matchUtilities, theme }) => {
        matchUtilities(
            {
                wrap: (value: string) => ({
                    "overflow-wrap": value
                })
            },
            { values: theme("overflowWrap"), type: ["any"] }
        )
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap#formal_syntax} */
            overflowWrap: {
                breakWord: "break-word",
                anywhere: "anywhere",
                normal: "normal"
            }
        }
    }
)
