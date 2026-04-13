import {
    type AtRule,
    type Comment,
    type Declaration,
    type Plugin,
    type Rule
} from "postcss"
import { type Config } from "postcss-load-config"

const REPLACE_PATTERN = /--(tw|toolwind)-/gi
const REPLACE_WITH = "--nhn-"

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
                const noOpacityRegex =
                    /color-mix\(in oklab, (var\(--[^)]+\)|currentColor) calc\((?:var\(--nhn-[\w-]+-opacity, ?1\)|1) \* 100%\), transparent\)/g

                if (noOpacityRegex.test(decl.value)) {
                    decl.value = decl.value.replace(noOpacityRegex, "$1")
                } else {
                    const calcRegex = /calc\(([\d.]+) \* 100%\)/g
                    decl.value = decl.value.replace(
                        calcRegex,
                        (_, numberStr: string) =>
                            `${(parseFloat(numberStr) * 100).toString()}%`
                    )
                }
            }
        },
        AtRule(atRule: AtRule) {
            if (REPLACE_PATTERN.test(atRule.params)) {
                atRule.params = atRule.params.replace(
                    REPLACE_PATTERN,
                    REPLACE_WITH
                )
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
        }
    }
}
optimizeAndReplacePlugin.postcss = true

export default {
    plugins: [
        "tailwindcss",
        optimizeAndReplacePlugin(),
        "autoprefixer"
    ] as never
} satisfies Config
