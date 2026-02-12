import plugin from "tailwindcss/plugin"

export default plugin(function ({ matchUtilities, theme }) {
    matchUtilities(
        {
            "bg-size": (value: string) => ({
                backgroundSize: value
            })
        },
        { values: theme("backgroundSize") }
    )
})
