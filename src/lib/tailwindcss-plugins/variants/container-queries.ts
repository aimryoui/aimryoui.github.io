import plugin from "tailwindcss/plugin"

export default plugin(function containerQueries({
    matchUtilities,
    matchVariant,
    theme
}) {
    let values: Record<string, string> = theme("containers")

    function parseValue(value: string) {
        let numericValue = /^(\d+\.\d+|\d+|\.\d+)\D+/u.exec(value)?.[1] ?? null
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

                // Sort values themselves regardless of unit
                if (a - z !== 0) return a - z

                let aLabel = aVariant.modifier ?? ""
                let zLabel = zVariant.modifier ?? ""

                // Explicitly move empty labels to the end
                if (aLabel === "" && zLabel !== "") {
                    return 1
                } else if (aLabel !== "" && zLabel === "") {
                    return -1
                }

                // Sort labels alphabetically in the English locale
                // We are intentionally overriding the locale because we do not want the sort to
                // be affected by the machine's locale (be it a developer or CI environment)
                return aLabel.localeCompare(zLabel, "en", { numeric: true })
            }
        }
    )
})
