import plugin from "tailwindcss/plugin"

// oxlint-disable-next-line @limegrass/import-alias/import-alias
import tailwindVariants from "../shared/tailwind-variants"

const sharedValues: Record<string, string> = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [String(i + 1), String(i + 1)])
)

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

    matchVariant(
        "group-not-nth",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(:nth-child(${value})) &`
                : `.group:not(:nth-child(${value})) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-not-nth-of-type",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(:nth-of-type(${value})) &`
                : `.group:not(:nth-of-type(${value})) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-not-nth-last",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(:nth-last-child(${value})) &`
                : `.group:not(:nth-last-child(${value})) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-not-nth-last-of-type",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:not(:nth-last-of-type(${value})) &`
                : `.group:not(:nth-last-of-type(${value})) &`,
        {
            values: sharedValues
        }
    )
})
