import plugin from "tailwindcss/plugin"

// oxlint-disable-next-line @limegrass/import-alias/import-alias
import tailwindVariants from "../shared/tailwind-variants"

export default plugin(({ matchVariant, theme }) => {
    matchVariant(
        "group-not",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(${value}) &`
                : `.group:not(${value}) &`,
        {
            values: tailwindVariants
        }
    )

    matchVariant(
        "group-not-hover",
        (_, { modifier }) => {
            const groupSelector = modifier ? `.group\\/${modifier}` : ".group"
            return [
                `${groupSelector}:hover &`,
                `@media not (hover: hover) { ${groupSelector} & }`
            ]
        },
        {
            values: { DEFAULT: "" }
        }
    )

    matchVariant(
        "group-not-aria",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(*[aria-${value}]) &`
                : `.group:not(*[aria-${value}]) &`,
        {
            values: theme("aria")
        }
    )
    matchVariant(
        "group-not-data",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(*[data-${value}]) &`
                : `.group:not(*[data-${value}]) &`,
        {
            values: theme("data")
        }
    )
})
