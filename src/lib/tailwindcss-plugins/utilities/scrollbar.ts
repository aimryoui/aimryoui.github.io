import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette"
import plugin from "tailwindcss/plugin"

export default plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                scrollbar: (value: string) => ({
                    /**
                     * Two valid colors. The first applies to the thumb of the
                     * scrollbar, the second to the track.
                     */
                    scrollbarColor: `${value} transparent`
                })
            },
            {
                values: flattenColorPalette(theme("colors")),
                type: ["color", "any"]
            }
        )
        matchUtilities(
            {
                scrollbar: (value: string) => ({
                    scrollbarWidth: value
                })
            },
            {
                values: theme("scrollBarWidth")
            }
        )
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-width} */
            scrollBarWidth: {
                none: "none",
                thin: "thin",
                auto: "auto"
            }
        }
    }
)
