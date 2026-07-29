import plugin from "tailwindcss/plugin"

export default plugin(
    function containerQueries({ matchUtilities, matchVariant, theme }) {
        let values: Record<string, string> = theme("containers")

        function parseValue(value: string) {
            let numericValue =
                /^(\d+\.\d+|\d+|\.\d+)\D+/u.exec(value)?.[1] ?? null
            if (numericValue === null) return null

            return parseFloat(value)
        }

        matchUtilities(
            {
                "@container": (value, { modifier }) => {
                    return {
                        "container-type": value,
                        "container-name": modifier
                    }
                }
            },
            {
                /** @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type#syntax} */
                values: {
                    DEFAULT: "inline-size",
                    size: "size",
                    normal: "normal",
                    "scroll-state": "scroll-state",
                    anchored: "anchored"
                },
                type: ["lookup", "any"],
                modifiers: "any"
            }
        )

        matchVariant(
            "@",
            (value, { modifier }) => {
                let parsed = parseValue(value)

                return parsed === null
                    ? []
                    : `@container ${modifier ?? ""} (max-width: ${value})`
            },
            {
                values,
                sort(aVariant, zVariant) {
                    let a = parseFloat(aVariant.value)
                    let z = parseFloat(zVariant.value)

                    if (Number.isNaN(a) || Number.isNaN(z)) return 0

                    if (a - z !== 0) return z - a

                    let aLabel = aVariant.modifier ?? ""
                    let zLabel = zVariant.modifier ?? ""

                    if (aLabel === "" && zLabel !== "") {
                        return 1
                    } else if (aLabel !== "" && zLabel === "") {
                        return -1
                    }

                    return aLabel.localeCompare(zLabel, "en", { numeric: true })
                }
            }
        )
    },
    {
        theme: {
            containers: {
                "3xs": "16rem",
                "2xs": "18rem",
                xs: "20rem",
                sm: "24rem",
                md: "28rem",
                lg: "32rem",
                xl: "36rem",
                "2xl": "42rem",
                "3xl": "48rem",
                "4xl": "56rem",
                "5xl": "64rem",
                "6xl": "72rem",
                "7xl": "80rem"
            }
        }
    }
)
