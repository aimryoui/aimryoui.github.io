import plugin from "tailwindcss/plugin"

const sharedValues: Record<string, string> = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [String(i + 1), String(i + 1)])
)

export default plugin(({ matchVariant }) => {
    matchVariant("nth", (value) => `&:nth-child(${value})`, {
        values: sharedValues
    })
    matchVariant("nth-of-type", (value) => `&:nth-of-type(${value})`, {
        values: sharedValues
    })
    matchVariant("nth-last", (value) => `&:nth-last-child(${value})`, {
        values: sharedValues
    })
    matchVariant(
        "nth-last-of-type",
        (value) => `&:nth-last-of-type(${value})`,
        {
            values: sharedValues
        }
    )
})
