import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ matchUtilities }) {
        matchUtilities({
            "bg-position": (value: string) => ({
                backgroundPosition: value
            })
        })
    },
    {
        theme: {
            /** @see {@link https://tailwindcss.com/docs/background-position#using-a-custom-value} */
            backgroundPosition: {
                "top-left": "top left",
                top: "top",
                "top-right": "top right",
                left: "left",
                center: "center",
                right: "right",
                "bottom-left": "bottom left",
                bottom: "bottom",
                "bottom-right": "bottom right"
            }
        }
    }
)
