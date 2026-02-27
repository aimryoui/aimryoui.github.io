import plugin from "tailwindcss/plugin"

export default plugin(({ matchVariant }) => {
    matchVariant("is", (value) => `&:is(${value})`, {
        values: {}
    })
})
