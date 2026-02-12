import plugin from "tailwindcss/plugin"

export default plugin(function ({ matchVariant }) {
    matchVariant("is", (value) => `&:is(${value})`, {
        values: {}
    })
})
