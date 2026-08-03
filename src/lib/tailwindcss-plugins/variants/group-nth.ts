import plugin from "tailwindcss/plugin"

const sharedValues: Record<string, string> = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [String(i + 1), String(i + 1)])
)

export default plugin(({ matchVariant }) => {
    matchVariant(
        "group-nth",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:nth-child(${value}) &`
                : `.group:nth-child(${value}) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-nth-of-type",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:nth-of-type(${value}) &`
                : `.group:nth-of-type(${value}) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-nth-last",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:nth-last-child(${value}) &`
                : `.group:nth-last-child(${value}) &`,
        {
            values: sharedValues
        }
    )
    matchVariant(
        "group-nth-last-of-type",
        (value, { modifier }) =>
            modifier
                ? `.group\\/${modifier}:nth-last-of-type(${value}) &`
                : `.group:nth-last-of-type(${value}) &`,
        {
            values: sharedValues
        }
    )
})
