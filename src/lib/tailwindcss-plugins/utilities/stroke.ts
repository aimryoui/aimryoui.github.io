import plugin from "tailwindcss/plugin"

export default plugin(
    ({ matchUtilities, theme }) => {
        matchUtilities(
            {
                "stroke-dashed": (value: string) => ({
                    strokeDasharray: `calc(${value} * 2.75) calc(${value} * 1.75)`
                })
            },
            {
                values: theme("strokeDasharray"),
                type: ["any"]
            }
        )
    },
    {
        theme: {
            strokeDasharray: {
                DEFAULT: "var(--px)"
            }
        }
    }
)
