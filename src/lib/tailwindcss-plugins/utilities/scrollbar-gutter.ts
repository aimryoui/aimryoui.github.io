import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            "scrollbar-gutter": (value: string) => ({
                "scrollbar-gutter": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter#formal_syntax} */
            values: {
                auto: "auto",
                stable: "stable",
                both: "stable both-edges"
            },
            type: ["lookup"]
        }
    )
})
