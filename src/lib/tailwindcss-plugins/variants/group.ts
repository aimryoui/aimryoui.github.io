// oxlint-disable @limegrass/import-alias/import-alias
import plugin from "tailwindcss/plugin"

import { AVAILABLE_EFFECTS } from "../../../configs/effects.config"

const sharedValues: Record<string, string> = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [String(i + 1), String(i + 1)])
)

export default plugin(({ matchVariant }) => {
    matchVariant(
        "group-is",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):is(${value}) &`
                : `:merge(.group):is(${value}) &`,
        {
            values: {}
        }
    )

    matchVariant(
        "group-nth",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):nth-child(${value}) &`
                : `:merge(.group):nth-child(${value}) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-nth-of-type",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):nth-of-type(${value}) &`
                : `:merge(.group):nth-of-type(${value}) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-nth-last",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):nth-last-child(${value}) &`
                : `:merge(.group):nth-last-child(${value}) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-nth-last-of-type",
        (value, { modifier }) =>
            modifier
                ? `:merge(.group\\/${modifier}):nth-last-of-type(${value}) &`
                : `:merge(.group):nth-last-of-type(${value}) &`,
        {
            values: sharedValues
        }
    )

    AVAILABLE_EFFECTS.forEach((effect) => {
        matchVariant(
            `group-data-${effect}`,
            (_, { modifier }) => {
                const groupSelector = modifier
                    ? `:merge(.group\\/${modifier})`
                    : ":merge(.group)"
                return [
                    `@media (prefers-reduced-motion: no-preference) { ${groupSelector}:where([data-motion=system], [data-motion=system] *):where([data-effects~='${effect}'], [data-effects~='${effect}'] *) & }`,
                    `${groupSelector}:where([data-motion=preferred], [data-motion=preferred] *):where([data-effects~='${effect}'], [data-effects~='${effect}'] *) &`
                ]
            },
            {
                values: { DEFAULT: "" }
            }
        )
    })
})
