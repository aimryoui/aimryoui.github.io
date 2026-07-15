import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities(
        {
            "view-transition": (value: string) => ({
                "view-transition-name": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-transition-name#formal_syntax} */
            values: {
                none: "none"
            },
            type: ["lookup", "any"]
        }
    )
    matchUtilities(
        {
            "view-transition-class": (value: string) => ({
                "view-transition-class": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-transition-class#formal_syntax} */
            values: {
                none: "none"
            },
            type: ["lookup", "any"]
        }
    )
    matchUtilities(
        {
            "view-transition-scope": (value: string) => ({
                "view-transition-scope": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-transition-scope#formal_syntax} */
            values: {
                none: "none",
                all: "all"
            },
            type: ["lookup"]
        }
    )
})
