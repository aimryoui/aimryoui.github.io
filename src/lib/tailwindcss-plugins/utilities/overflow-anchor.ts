import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            "overflow-anchor": (value: string) => ({
                "overflow-anchor": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-anchor#formal_syntax} */
            values: {
                auto: "auto",
                none: "none"
            },
            type: ["lookup"]
        }
    )
})
