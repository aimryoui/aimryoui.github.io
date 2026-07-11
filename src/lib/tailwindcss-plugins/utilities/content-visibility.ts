import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            content: (value: string) => ({
                "content-visibility": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility#formal_syntax} */
            values: {
                visible: "visible",
                hidden: "hidden",
                auto: "auto"
            },
            type: ["lookup"]
        }
    )
})
