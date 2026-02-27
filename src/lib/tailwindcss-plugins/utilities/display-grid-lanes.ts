import plugin from "tailwindcss/plugin"

export default plugin(({ addBase, addUtilities, matchUtilities, theme }) => {
    addBase({
        "@property --default-flow-tolerance": {
            /**
             * Should be '<length> | <percentage>' but
             * https://stackoverflow.com/a/68871702
             */
            syntax: "'*'",
            inherits: "true",
            initialValue: "1em"
        }
    })
    addUtilities({
        ".grid-lanes": {
            "--grid-lanes-polyfill": "1",
            display: "grid-lanes",
            "--flow-tolerance":
                "var(--tw-flow-tolerance, var(--default-flow-tolerance))",
            flowTolerance:
                "var(--tw-flow-tolerance, var(--default-flow-tolerance))"
        }
    })
    matchUtilities(
        {
            tolerance: (value: string) => ({
                "--tw-flow-tolerance": value,
                flowTolerance: value
            })
        },
        { values: theme("spacing") }
    )
})
