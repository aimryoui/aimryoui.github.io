/**
 * @type {import('postcss-load-config').Config}
 */

const config = {
    plugins: {
        "@tailwindcss/postcss": {},
        "postcss-replace": {
            pattern: /(--(tw|os)-)/gi,
            data: {
                "--tw-": "--nhn-"
            }
        }
    }
}

export default config
