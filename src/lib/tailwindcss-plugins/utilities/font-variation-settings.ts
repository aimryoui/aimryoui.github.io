import plugin from "tailwindcss/plugin"

const AXIS_VAR: Record<string, string> = {
    wght: "--tw-font-wght",
    slnt: "--tw-font-slnt",
    ital: "--tw-font-ital",
    ROND: "--tw-font-rond",
    GRAD: "--tw-font-grad"
}

const AXIS_DEFAULTS: Record<string, string> = {
    "--tw-font-wght": "400",
    "--tw-font-slnt": "0",
    "--tw-font-ital": "0",
    "--tw-font-rond": "0",
    "--tw-font-grad": "0"
}

const COMPOSED_VALUE = Object.entries(AXIS_VAR)
    .map(([tag, varName]) => `"${tag}" var(${varName})`)
    .join(", ")

export default plugin(
    ({ addBase, matchUtilities, theme }) => {
        addBase(
            Object.values(AXIS_VAR).reduce<
                Record<string, Record<string, string>>
            >((acc, varName) => {
                acc[`@property ${varName}`] = {
                    syntax: "'<number>'",
                    inherits: "true",
                    initialValue: AXIS_DEFAULTS[varName]
                }
                return acc
            }, {})
        )

        const axisConfigs: {
            prefix: string
            tag: string
            values: Record<string, string>
            supportsNegativeValues?: boolean
        }[] = [
            {
                prefix: "font-wght",
                tag: "wght",
                values: theme("fontVariationWeight")
            },
            {
                prefix: "font-slnt",
                tag: "slnt",
                values: theme("fontVariationSlant"),
                supportsNegativeValues: true
            },
            {
                prefix: "font-ital",
                tag: "ital",
                values: theme("fontVariationItalic")
            },
            {
                prefix: "font-rond",
                tag: "ROND",
                values: theme("fontVariationRoundness")
            },
            {
                prefix: "font-grad",
                tag: "GRAD",
                values: theme("fontVariationGrade"),
                supportsNegativeValues: true
            }
        ]

        axisConfigs.forEach(
            ({ prefix, tag, values, supportsNegativeValues }) => {
                const varName = AXIS_VAR[tag]

                matchUtilities(
                    {
                        [prefix]: (value: string) => ({
                            [varName]: value,
                            fontVariationSettings: COMPOSED_VALUE
                        })
                    },
                    {
                        values,
                        type: ["number", "any"],
                        supportsNegativeValues: supportsNegativeValues ?? false
                    }
                )
            }
        )

        matchUtilities(
            {
                "font-wdth": (value: string) => ({
                    fontStretch: value
                })
            },
            {
                values: theme("fontVariationWidth"),
                type: ["any"]
            }
        )

        matchUtilities(
            {
                "font-opsz": (value: string) => ({
                    fontOpticalSizing: value
                })
            },
            {
                values: theme("fontVariationOpticalSize"),
                type: ["any"]
            }
        )
    },
    {
        theme: {
            fontVariationWeight: {
                1: "1",
                100: "100",
                200: "200",
                300: "300",
                400: "400",
                450: "450",
                500: "500",
                550: "550",
                600: "600",
                650: "650",
                700: "700",
                800: "800",
                900: "900",
                1000: "1000"
            },
            fontVariationWidth: {
                25: "25%",
                50: "50%",
                "62.5": "62.5%",
                75: "75%",
                "87.5": "87.5%",
                100: "100%",
                "112.5": "112.5%",
                125: "125%",
                150: "150%",
                200: "200%"
            },
            fontVariationSlant: Object.fromEntries(
                Array.from({ length: 19 }, (_, i) => {
                    const v = (i - 9) * 10 // -90 to 90 in steps of 10
                    return [String(v), String(v)]
                })
            ),
            fontVariationItalic: {
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9"
            },
            fontVariationOpticalSize: {
                none: "none",
                auto: "auto"
            },
            fontVariationRoundness: Object.fromEntries(
                Array.from({ length: 11 }, (_, i) => {
                    const v = i * 10 // 0 to 100 in steps of 10
                    return [String(v), String(v)]
                })
            ),
            fontVariationGrade: {
                "-100": "-100",
                "-50": "-50",
                0: "0",
                50: "50",
                100: "100"
            }
        }
    }
)
