import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities, theme }) => {
    matchUtilities(
        {
            quad: (value: string) => ({
                "word-spacing": value
            })
        },
        {
            values: theme("letterSpacing"),
            type: ["any"]
        }
    )
})
