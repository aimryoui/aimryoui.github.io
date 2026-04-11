import plugin from "tailwindcss/plugin"

// oxlint-disable-next-line @limegrass/import-alias/import-alias
import tailwindVariants from "../shared/tailwind-variants"

export default plugin(({ addVariant, matchVariant, theme }) => {
    matchVariant("not", (value) => `&:not(${value})`, {
        values: tailwindVariants
    })
    addVariant("not-hover", ["&:hover", "@media not (hover: hover)"])

    addVariant(
        "not-motion-safe",
        "@media not (prefers-reduced-motion: no-preference)"
    )
    addVariant(
        "not-motion-reduce",
        "@media not (prefers-reduced-motion: reduce)"
    )
    addVariant("not-contrast-more", "@media not (prefers-contrast: more)")
    addVariant("not-contrast-less", "@media not (prefers-contrast: less)")
    addVariant("not-2xl", "@media not (max-width: 96rem)")
    addVariant("not-xl", "@media not (max-width: 80rem)")
    addVariant("not-lg", "@media not (max-width: 64rem)")
    addVariant("not-md", "@media not (max-width: 48rem)")
    addVariant("not-sm", "@media not (max-width: 40rem)")
    addVariant("not-portrait", "@media not (orientation: portrait)")
    addVariant("not-landscape", "@media not (orientation: landscape)")
    addVariant("not-dark", "@media not (prefers-color-scheme: dark)")
    addVariant("not-print", "@media not print")
    addVariant("not-forced-colors", "@media not (forced-colors: active)")
    addVariant("not-inverted-colors", "@media not (inverted-colors: inverted)")
    addVariant("not-pointer-none", "@media not (pointer: none)")
    addVariant("not-pointer-coarse", "@media not (pointer: coarse)")
    addVariant("not-pointer-fine", "@media not (pointer: fine)")
    addVariant("not-any-pointer-none", "@media not (any-pointer: none)")
    addVariant("not-any-pointer-coarse", "@media not (any-pointer: coarse)")
    addVariant("not-any-pointer-fine", "@media not (any-pointer: fine)")
    addVariant("not-noscript", "@media not (scripting: none)")

    matchVariant("not-aria", (value) => `&:not(*[aria-${value}])`, {
        values: theme("aria")
    })
    matchVariant("not-data", (value) => `&:not(*[data-${value}])`, {
        values: theme("data")
    })
})
