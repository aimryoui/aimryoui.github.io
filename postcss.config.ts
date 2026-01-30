const config = {
    plugins: {
        "@tailwindcss/postcss": {},
        "postcss-replace": {
            pattern: /(--tw-)/gi,
            data: {
                "--tw-": "--nhn-"
            }
        }
    }
}

export default config
