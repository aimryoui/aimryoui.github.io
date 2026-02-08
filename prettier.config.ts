import { type Config } from "prettier"

const config: Config = {
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: false,
    quoteProps: "as-needed",
    jsxSingleQuote: false,
    trailingComma: "none",
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: "always",
    requirePragma: false,
    insertPragma: false,
    proseWrap: "preserve",
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",
    singleAttributePerLine: false,
    plugins: [
        "prettier-plugin-jsdoc",
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss"
    ],
    tailwindAttributes: ["tw"],
    tailwindFunctions: ["cn", "cva", "twMerge"],
    importOrder: [
        "<BUILTIN_MODULES>",
        ".css$",
        "^react$",
        "",
        "<THIRD_PARTY_MODULES>",
        "",
        "^@/",
        "",
        "^~/",
        "",
        "^[./]"
    ],
    importOrderTypeScriptVersion: "5.9.3",
    overrides: [
        {
            files: ["*.yml", "*.yaml"],
            options: {
                tabWidth: 2
            }
        }
    ]
}

export default config
