import plugin from "tailwindcss/plugin"

export default plugin(({ addVariant, matchVariant }) => {
    addVariant("slotted", "&::slotted(*)")
    matchVariant("slotted", (value) => `&::slotted(${value})`, {
        values: {}
    })
})
