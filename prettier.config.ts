import { type Config as PrettierConfig } from "prettier"
import { type PluginOptions as TailwindConfig } from "prettier-plugin-tailwindcss"

type StrictConfig = {
    [K in keyof PrettierConfig as string extends K
        ? never
        : K]: PrettierConfig[K]
}

type Config = StrictConfig & TailwindConfig

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
    singleAttributePerLine: false,
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindAttributes: ["containerClassName", "tw"],
    tailwindFunctions: ["cn", "cva", "twg", "twMerge"],
    tailwindPreserveDuplicates: true,
    overrides: [
        {
            files: ["*.yml", "*.yaml"],
            options: {
                tabWidth: 2
            }
        }
    ]
} satisfies Config

export default config
