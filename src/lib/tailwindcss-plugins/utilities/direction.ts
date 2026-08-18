import plugin from "tailwindcss/plugin"

export default plugin(({ addUtilities }) => {
    addUtilities({
        ".rtl": {
            direction: "rtl"
        }
    })
    addUtilities({
        ".ltr": {
            direction: "ltr"
        }
    })
})
