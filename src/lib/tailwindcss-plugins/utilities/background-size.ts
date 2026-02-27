import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities, theme }) => {
    matchUtilities(
        {
            "bg-size": (value: string) => ({
                backgroundSize: value
            })
        },
        {
            values: theme("backgroundSize"),
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-size#formal_syntax} */
            type: ["length", "percentage", "any"]
        }
    )
})
