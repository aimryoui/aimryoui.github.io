import { type Config as PrettierConfig } from "prettier"

type StrictConfig = {
    [K in keyof PrettierConfig as string extends K
        ? never
        : K]: PrettierConfig[K]
}

interface PluginOptions {
    tailwindAttributes?: string[]
    tailwindFunctions?: string[]
}

type Config = StrictConfig & PluginOptions

const config = {
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
    singleAttributePerLine: false
} satisfies Config

export default config
