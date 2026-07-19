import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities }) => {
    matchUtilities({
        transform: (value: string) => ({
            transform: value
        })
    })
})
