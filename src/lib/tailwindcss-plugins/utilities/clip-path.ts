import plugin from "tailwindcss/plugin"

const basicShapes = [
    "inset",
    "circle",
    "ellipse",
    "polygon",
    "path",
    "rect",
    "shape",
    "xywh"
]

export default plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                clip: (value: string) => ({
                    clipPath: value
                })
            },
            { values: theme("clipPath") }
        )
        // <basic-shape>
        basicShapes.forEach((shape) => {
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
            /** @track {@link https://github.com/tailwindlabs/tailwindcss-intellisense/discussions/1455} */
            clipPathBasicShapes: {
                "[]": ""
            }
        }
    }
)
