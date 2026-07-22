import plugin from "tailwindcss/plugin"

export default plugin(({ addVariant }) => {
    addVariant(
        "apple",
        "@supports (-apple-pay-button-style: black) or (-webkit-touch-callout: none)"
    )
    addVariant(
        "not-apple",
        "@supports (not (-apple-pay-button-style: black)) and (not (-webkit-touch-callout: none))"
    )
})
