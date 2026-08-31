// oxlint-disable @limegrass/import-alias/import-alias
import plugin from "tailwindcss/plugin"

import { AVAILABLE_EFFECTS } from "../../../configs/effects.config"
import tailwindVariants from "../shared/tailwind-variants"

const sharedValues: Record<string, string> = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [String(i + 1), String(i + 1)])
)

export default plugin(({ matchVariant, theme }) => {
    matchVariant(
        "group-not",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):not(${value}) &`
                : `:merge(.group):not(${value}) &`,
        {
            values: tailwindVariants
        }
    )

    matchVariant(
        "group-not-hover",
        (_, { modifier }) => {
            const groupSelector = modifier
                ? `:merge(.group\\/${modifier})`
                : ":merge(.group)"
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
                ? `:merge(.group\\/${modifier}):not(*[aria-${value}]) &`
                : `:merge(.group):not(*[aria-${value}]) &`,
        {
            values: theme("aria")
        }
    )
    matchVariant(
        "group-not-data",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):not(*[data-${value}]) &`
                : `:merge(.group):not(*[data-${value}]) &`,
        {
            values: theme("data")
        }
    )

    matchVariant(
        "group-not-nth",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):not(:nth-child(${value})) &`
                : `:merge(.group):not(:nth-child(${value})) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-not-nth-of-type",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):not(:nth-of-type(${value})) &`
                : `:merge(.group):not(:nth-of-type(${value})) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-not-nth-last",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):not(:nth-last-child(${value})) &`
                : `:merge(.group):not(:nth-last-child(${value})) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-not-nth-last-of-type",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):not(:nth-last-of-type(${value})) &`
                : `:merge(.group):not(:nth-last-of-type(${value})) &`,
        {
            values: sharedValues
        }
    )

    AVAILABLE_EFFECTS.forEach((effect) => {
        matchVariant(
            `group-not-data-${effect}`,
            (_, { modifier }) => {
                const groupSelector = modifier
                    ? `:merge(.group\\/${modifier})`
                    : ":merge(.group)"
                return [
                    `${groupSelector}:not(:where([data-effects~='${effect}'], [data-effects~='${effect}'] *)) &`,
                    `${groupSelector}:where([data-motion=reduced], [data-motion=reduced] *) &`,
                    `@media (prefers-reduced-motion: reduce) { ${groupSelector}:where([data-motion=system], [data-motion=system] *) & }`
                ]
            },
            {
                values: { DEFAULT: "" }
            }
        )
    })
})
