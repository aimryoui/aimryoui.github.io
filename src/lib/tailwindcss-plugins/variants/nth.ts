import plugin from "tailwindcss/plugin"

const sharedValues = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10"
}

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
