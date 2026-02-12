import plugin from "tailwindcss/plugin"

/** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape#corner--shape_shorthands_and_longhands} */
const CORNER_DEFINITIONS = [
    ["corner", ["corner-shape"]],
    // Physical Side Shorthands (Top, Right, Bottom, Left)
    ["corner-t", ["corner-top-left-shape", "corner-top-right-shape"]],
    ["corner-r", ["corner-top-right-shape", "corner-bottom-right-shape"]],
    ["corner-b", ["corner-bottom-right-shape", "corner-bottom-left-shape"]],
    ["corner-l", ["corner-top-left-shape", "corner-bottom-left-shape"]],
    // Logical Side Shorthands (Start, End - base on dir)
    ["corner-s", ["corner-start-start-shape", "corner-end-start-shape"]],
    ["corner-e", ["corner-start-end-shape", "corner-end-end-shape"]],
    // Logical Side Shorthands (Block start/end)
    ["corner-bs", ["corner-start-start-shape", "corner-start-end-shape"]],
    ["corner-be", ["corner-end-start-shape", "corner-end-end-shape"]],
    // Physical Corners
    ["corner-tl", ["corner-top-left-shape"]],
    ["corner-tr", ["corner-top-right-shape"]],
    ["corner-br", ["corner-bottom-right-shape"]],
    ["corner-bl", ["corner-bottom-left-shape"]],
    // Logical Corners
    ["corner-ss", ["corner-start-start-shape"]],
    ["corner-se", ["corner-start-end-shape"]],
    ["corner-ee", ["corner-end-end-shape"]],
    ["corner-es", ["corner-end-start-shape"]]
] as const

export default plugin(
    function ({ addUtilities, matchUtilities, theme }) {
        CORNER_DEFINITIONS.forEach(([prefix, properties]) => {
            matchUtilities(
                {
                    [prefix]: (value: string) => {
                        const styles: Record<string, string> = {}
                        properties.forEach((prop) => {
                            styles[prop] = value
                        })
                        return styles
                    }
                },
                {
                    values: theme("cornerShape")
                }
            )
        })

        CORNER_DEFINITIONS.forEach(([prefix, properties]) => {
            const superellipsePrefix =
                prefix === "corner"
                    ? "corner-superellipse"
                    : prefix.replace("corner-", "corner-superellipse-")

            matchUtilities(
                {
                    [superellipsePrefix]: (value: string) => {
                        const styles: Record<string, string> = {}
                        properties.forEach((prop) => {
                            styles[prop] = `superellipse(${value})`
                        })
                        return styles
                    }
                },
                {
                    values: theme("cornerSuperellipse"),
                    supportsNegativeValues: true
                }
            )
        })

        const infinityUtilities: Record<string, Record<string, string>> = {}

        /**
         * Because `supportsNegativeValues` does not support negative string
         * values.
         */
        CORNER_DEFINITIONS.forEach(([prefix, properties]) => {
            const superellipsePrefix =
                prefix === "corner"
                    ? "corner-superellipse"
                    : prefix.replace("corner-", "corner-superellipse-")

            const className = `.-${superellipsePrefix}-infinity`
            const styles: Record<string, string> = {}
            properties.forEach((prop) => {
                styles[prop] = "superellipse(-infinity)"
            })
            infinityUtilities[className] = styles
        })

        addUtilities(infinityUtilities)
    },
    {
        theme: {
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape} */
            cornerShape: {
                round: "round",
                scoop: "scoop",
                bevel: "bevel",
                notch: "notch",
                square: "square",
                squircle: "squircle",
                inherit: "inherit"
            },
            /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/superellipse} */
            cornerSuperellipse: {
                DEFAULT: "1.5",
                "0": "0",
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                infinity: "infinity"
            }
        }
    }
)
