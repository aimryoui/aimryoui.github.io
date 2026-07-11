import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            field: (value: string) => ({
                "field-sizing": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing#formal_syntax} */
            values: {
                content: "content",
                fixed: "fixed"
            },
            type: ["lookup"]
        }
    )
})
