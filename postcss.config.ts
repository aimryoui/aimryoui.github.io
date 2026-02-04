const config = {
    plugins: {
        "@tailwindcss/postcss": {},
        "postcss-replace": {
            pattern: /(--(tw|toolwind)-)/gi,
            data: {
                replaceAll: "--nhn-"
            }
        }
    }
}

export default config
