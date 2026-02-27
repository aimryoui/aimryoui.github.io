import plugin from "tailwindcss/plugin"

export default plugin(
    ({ matchUtilities, theme }) => {
        matchUtilities(
            {
                "bg-clip": (value: string) => ({
                    backgroundClip: value
                })
            },
            { values: theme("backgroundClip"), type: ["any"] }
        )
    },
    {
        theme: {
            extend: {
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-clip} */
                backgroundClip: {
                    area: "border-area",
                    inherit: "inherit"
                }
            }
        }
    }
)
