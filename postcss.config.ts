import postcssOklabFunction from "@csstools/postcss-oklab-function"
import {
    type AtRule,
    type Comment,
    type Declaration,
    type Plugin,
    type Root,
    type Rule
} from "postcss"
import { type Config } from "postcss-load-config"

const REPLACE_PATTERN = /--(tw|toolwind)-/giu
const REPLACE_WITH = "--nhn-"

const NO_OPACITY_COLOR_MIX_REGEX =
    /color-mix\(in oklab, (var\(--[^)]+\)|currentColor) calc\((?:var\(--nhn-[\w-]+-opacity, ?1\)|1) \* 100%\), transparent\)/gu
const CALC_PERCENTAGE_REGEX = /calc\(([\d.]+) \* 100%\)/gu

const SUPPORTS_LIGHT_DARK_REGEX_COME_FIRST =
    /\(color:\s*light-dark\(red,\s*red\)\)\s*and\s*/gu
const SUPPORTS_LIGHT_DARK_REGEX_COME_LAST =
    /\s*and\s*\(color:\s*light-dark\(red,\s*red\)\)/gu

const optimizeAndReplacePlugin = (): Plugin => {
    return {
        postcssPlugin: "optimize-and-replace",
        Declaration(decl: Declaration) {
            // Property
            if (REPLACE_PATTERN.test(decl.prop)) {
                decl.prop = decl.prop.replace(REPLACE_PATTERN, REPLACE_WITH)
            }
            // Value
            if (REPLACE_PATTERN.test(decl.value)) {
                decl.value = decl.value.replace(REPLACE_PATTERN, REPLACE_WITH)
            }

            if (decl.value.includes("color-mix(in oklab")) {
                if (NO_OPACITY_COLOR_MIX_REGEX.test(decl.value)) {
                    decl.value = decl.value.replace(
                        NO_OPACITY_COLOR_MIX_REGEX,
                        "$1"
                    )
                } else {
                    decl.value = decl.value.replace(
                        CALC_PERCENTAGE_REGEX,
                        (_, numberStr: string) =>
                            `${(parseFloat(numberStr) * 100).toString()}%`
                    )
                }
            }
        },
        Rule(rule: Rule) {
            if (REPLACE_PATTERN.test(rule.selector)) {
                rule.selector = rule.selector.replace(
                    REPLACE_PATTERN,
                    REPLACE_WITH
                )
            }
        },
        Comment(comment: Comment) {
            if (REPLACE_PATTERN.test(comment.text)) {
                comment.text = comment.text.replace(
                    REPLACE_PATTERN,
                    REPLACE_WITH
                )
            }
        },
        OnceExit(root: Root) {
            root.walkAtRules((atRule: AtRule) => {
                if (REPLACE_PATTERN.test(atRule.params)) {
                    atRule.params = atRule.params.replace(
                        REPLACE_PATTERN,
                        REPLACE_WITH
                    )
                }

                if (
                    atRule.name === "supports" &&
                    atRule.params.includes("(color: light-dark(red, red))")
                ) {
                    atRule.params = atRule.params
                        .replace(SUPPORTS_LIGHT_DARK_REGEX_COME_FIRST, "")
                        .replace(SUPPORTS_LIGHT_DARK_REGEX_COME_LAST, "")
                }
            })
        }
    }
}
optimizeAndReplacePlugin.postcss = true

export default {
    plugins: [
        "tailwindcss",
        postcssOklabFunction({
            preserve: true,
            subFeatures: {
                displayP3: false
            }
        }),
        optimizeAndReplacePlugin()
    ] as never
} satisfies Config
