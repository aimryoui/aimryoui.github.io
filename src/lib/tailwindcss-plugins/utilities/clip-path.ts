import plugin from "tailwindcss/plugin"

const BASIC_SHAPES = [
    "inset",
    "circle",
    "ellipse",
    "polygon",
    "path",
    "rect",
    "shape",
    "xywh"
] as const

export default plugin(
    ({ addUtilities, matchUtilities, theme }) => {
        matchUtilities(
            {
                clip: (value: string) => ({
                    "clip-path": value
                })
            },
            { values: theme("clipPath"), type: ["url", "any"] }
        )
        addUtilities({
            ".clip-star": {
                "clip-path": /* css */ `polygon(
                    50% 0,
                    calc(50% * (1 + sin(0.4turn))) calc(50% * (1 - cos(0.4turn))),
                    calc(50% * (1 - sin(0.2turn))) calc(50% * (1 - cos(0.2turn))),
                    calc(50% * (1 + sin(0.2turn))) calc(50% * (1 - cos(0.2turn))),
                    calc(50% * (1 - sin(0.4turn))) calc(50% * (1 - cos(0.4turn)))
                )`
            }
        })
        // <basic-shape>
        BASIC_SHAPES.forEach((shape) => {
            matchUtilities(
                {
                    [`clip-${shape}`]: (value: string) => ({
                        clipPath: `${shape}(${value})`
                    })
                },
                {
                    values: theme("clipPathBasicShapes"),
                    type: ["any"]
                }
            )
        })
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path} */
            clipPath: {
                none: "none",
                // <geometry-box>
                margin: "margin-box",
                border: "border-box",
                padding: "padding-box",
                content: "content-box",
                fill: "fill-box",
                stroke: "stroke-box",
                view: "view-box",

                unset: "unset"
            },
            /** @see {@link https://github.com/tailwindlabs/tailwindcss-intellisense/discussions/1455} */
            clipPathBasicShapes: {
                "[]": ""
            }
        }
    }
)
