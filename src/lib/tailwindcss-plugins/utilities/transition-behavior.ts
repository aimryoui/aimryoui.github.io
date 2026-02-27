import plugin from "tailwindcss/plugin"

export default plugin(
    ({ addUtilities, matchUtilities, theme }) => {
        const behaviorValues = theme("transitionBehavior") ?? {}

        const staticUtilities = Object.entries(behaviorValues).map(
            ([key, value]: [string, string]) => ({
                [`.transition-${key}`]: {
                    transitionBehavior: value
                }
            })
        )

        addUtilities(staticUtilities)

        matchUtilities(
            {
                "transition-behavior": (value: string) => ({
                    transitionBehavior: value
                })
            },
            {
                values: {},
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-behavior#formal_syntax} */
                type: ["any"]
            }
        )
    },
    {
        theme: {
            /** @see {@link https://tailwindcss.com/docs/transition-behavior#basic-example} */
            transitionBehavior: {
                normal: "normal",
                discrete: "allow-discrete"
            }
        }
    }
)
