import plugin from "tailwindcss/plugin"

export default plugin(({ addVariant }) => {
    addVariant("webkit", "@supports (-apple-pay-button-style: black)")
    addVariant("gecko", "@supports (-moz-appearance: none)")
    addVariant(
        "blink",
        "@supports (-webkit-appearance: none) and (not (-apple-pay-button-style: black)) and (not (-moz-appearance: none))"
    )
})
