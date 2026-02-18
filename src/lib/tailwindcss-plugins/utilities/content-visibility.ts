import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                content: (value: string) => ({
                    contentVisibility: value
                })
            },
            { values: theme("contentVisibility") }
        )
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility} */
            contentVisibility: {
                visible: "visible",
                hidden: "hidden",
                auto: "auto"
            }
        }
    }
)
