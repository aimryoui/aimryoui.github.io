import plugin from "tailwindcss/plugin"

export default plugin(({ addUtilities, matchUtilities }) => {
    // mask-clip
    matchUtilities(
        {
            "mask-clip": (value: string) => ({
                "mask-clip": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-clip#formal_syntax} */
            values: {
                border: "border-box",
                padding: "padding-box",
                content: "content-box",
                fill: "fill-box",
                stroke: "stroke-box",
                view: "view-box"
            },
            type: ["lookup", "any"]
        }
    )
    addUtilities({
        ".mask-no-clip": {
            "mask-clip": "no-clip"
        }
    })
    // mask-composite
    matchUtilities(
        {
            mask: (value: string) => ({
                "mask-composite": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-composite#formal_syntax} */
            values: {
                add: "add",
                subtract: "subtract",
                intersect: "intersect",
                exclude: "exclude"
            },
            type: ["lookup"]
        }
    )
    // mask-origin
    matchUtilities(
        {
            "mask-origin": (value: string) => ({
                "mask-origin": value
            })
        },
        {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-origin#formal_syntax} */
            values: {
                border: "border-box",
                padding: "padding-box",
                content: "content-box",
                fill: "fill-box",
                stroke: "stroke-box",
                view: "view-box"
            },
            type: ["lookup", "any"]
        }
    )
})
