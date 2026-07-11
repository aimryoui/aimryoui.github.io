import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            backface: (value: string) => ({
                "backface-visibility": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backface-visibility#formal_syntax} */
            values: {
                visible: "visible",
                hidden: "hidden"
            },
            type: ["lookup"]
        }
    )
})
