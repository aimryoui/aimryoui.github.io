import plugin from "tailwindcss/plugin"

// oxlint-disable-next-line @limegrass/import-alias/import-alias
import tailwindVariants from "../shared/tailwind-variants"

export default plugin(({ addVariant, matchVariant, theme }) => {
    matchVariant("has", (value) => `&:has(${value})`, {
        values: tailwindVariants
    })
    addVariant("has-hover", ["&:hover", "@media (hover: hover)"])

    matchVariant("has-aria", (value) => `&:has(*[aria-${value}])`, {
        values: theme("aria")
    })
    matchVariant("has-data", (value) => `&:has(*[data-${value}])`, {
        values: theme("data")
    })
})
