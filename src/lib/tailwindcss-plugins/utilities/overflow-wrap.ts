import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            wrap: (value: string) => ({
                "overflow-wrap": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap#formal_syntax} */
            values: {
                breakWord: "break-word",
                anywhere: "anywhere",
                normal: "normal"
            },
            type: ["lookup"]
        }
    )
})
