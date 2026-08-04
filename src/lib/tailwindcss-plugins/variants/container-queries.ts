import plugin from "tailwindcss/plugin"

const UNDERSCORE_REGEX = /_/gu
const VAR_ENV_REGEX = /(?:var|env)\([^)]+\)/gu
const OPERATOR_REGEX = /([0-9a-zA-Z%)_])\s*([+-])\s*(?=[0-9a-zA-Z(._-])/gu

function parseContainerValue(value: string) {
    let parsedValue = value.replace(UNDERSCORE_REGEX, " ")

    let placeholders: Record<string, string> = {}
    let counter = 0
    parsedValue = parsedValue.replace(VAR_ENV_REGEX, (match) => {
        let key = `__VAR_${counter++}__`
        placeholders[key] = match
        return key
    })

    parsedValue = parsedValue.replace(OPERATOR_REGEX, "$1 $2 ")

    for (let key in placeholders) {
        parsedValue = parsedValue.replace(key, placeholders[key])
    }

    return parsedValue
}

export default plugin(
    function containerQueries({ matchUtilities, matchVariant, theme }) {
        let values: Record<string, string> = theme("containers")

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
                const parsedValue = parseContainerValue(value)
                return `@container ${modifier ?? ""} (max-width: ${parsedValue})`
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
