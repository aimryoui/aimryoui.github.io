import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette"
import plugin from "tailwindcss/plugin"
import { type PluginAPI } from "tailwindcss/types/config"

const toColorValue = (
    value: string | ((options: { opacityValue?: string }) => string)
): string => {
    return typeof value === "function" ? value({}) : value
}

const SCROLLBAR_PARTS = ["thumb", "track", "corner"] as const

export default plugin(
    function ({ addUtilities, matchUtilities, theme }) {
        addUtilities({
            ".scrollbar-colored": {
                scrollbarColor:
                    "var(--tw-scrollbar-thumb-color) var(--tw-scrollbar-track-color)"
            }
        })
        SCROLLBAR_PARTS.forEach((part) => {
            matchUtilities(
                {
                    [`scrollbar-${part}`]: (value: string) => ({
                        [`--tw-scrollbar-${part}-color`]: toColorValue(value)
                    })
                },
                {
                    values: theme("scrollbarColor"),
                    type: ["color"]
                }
            )
        })
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
            scrollbarColor: ({ theme }: { theme: PluginAPI["theme"] }) => ({
                ...flattenColorPalette(theme("colors")),
                auto: "auto"
            }),
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-width} */
            scrollBarWidth: {
                none: "none",
                thin: "thin",
                auto: "auto"
            }
        }
    }
)
