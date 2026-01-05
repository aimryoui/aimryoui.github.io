// import typescriptParser from "@typescript-eslint/parser"
import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import eslint from "@eslint/js"
import importAlias from "@limegrass/eslint-plugin-import-alias"
import betterTailwind from "eslint-plugin-better-tailwindcss"
import { getDefaultCallees } from "eslint-plugin-better-tailwindcss/api/defaults"
import importPlugin from "eslint-plugin-import"
import importNewlines from "eslint-plugin-import-newlines"
import reactPlugin from "eslint-plugin-react"
import reactCompiler from "eslint-plugin-react-compiler"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import simpleImportPlugin from "eslint-plugin-simple-import-sort"
import tailwind from "eslint-plugin-tailwindcss"
import globals from "globals"
import path from "path"
import tseslint from "typescript-eslint"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended
})

/**
 * @param {string} name the plugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
    const plugin = compat.plugins(name)[0]?.plugins?.[alias]

    if (!plugin) {
        throw new Error(
            `Unable to resolve plugin ${name} and/or alias ${alias}`
        )
    }

    return fixupPluginRules(plugin)
}

//! DO NOT CHANGE THE ORDER OF RULES

export default tseslint.config(
    eslint.configs.recommended,

    //? Put `not supported` flat-config plugins as `recommended` here.
    //? Otherwise put them at the `//* Legacy Plugins` section below when you want to custom rules.
    ...compat.extends("plugin:import/typescript"),

    //* Global Config
    {
        //! Global ignores always stay alone
        ignores: [
            "**/node_modules/",
            "**/.git/",
            "**/.next/",
            "**/out/",
            "**/dist/",
            "public/old/",
            "./vite.config.ts",
            "**/*.mjs"
        ]
    },
    {
        //? Default ESLint rules here
        rules: {
            "no-unused-vars": 0
        }
    },
    //* TypeScript Plugin
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked
        ],
        plugins: {
            "@typescript-eslint": tseslint.plugin
        },
        linterOptions: {
            reportUnusedDisableDirectives: "warn"
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
                sourceType: "module",
                ecmaVersion: "latest",
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            "@typescript-eslint/no-unused-vars": 0,
            "@typescript-eslint/require-await": 0,
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/use-unknown-in-catch-callback-variable": 0,
            "@typescript-eslint/unbound-method": 0,
            "@typescript-eslint/no-unused-expressions": 0,
            // "@typescript-eslint/no-unnecessary-template-expression": 1,
            "@typescript-eslint/consistent-type-imports": [
                1,
                {
                    prefer: "type-imports",
                    fixStyle: "inline-type-imports"
                }
            ],
            "@typescript-eslint/consistent-generic-constructors": 1,
            "@typescript-eslint/no-unnecessary-condition": 1,
            "@typescript-eslint/no-unnecessary-template-expression": 1,
            "@typescript-eslint/prefer-nullish-coalescing": 1,
            "@typescript-eslint/no-unnecessary-type-parameters": 1,
            "@typescript-eslint/prefer-regexp-exec": 1
        }
    },
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    //* React Plugin
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "react-compiler": reactCompiler
        },
        rules: {
            ...reactPlugin.configs["jsx-runtime"].rules,
            ...reactHooksPlugin.configs.recommended.rules,
            "react/no-unknown-property": [
                1,
                {
                    ignore: ["tw", "vaul-drawer-wrapper", "cmdk-input-wrapper"]
                }
            ],
            "react/jsx-no-useless-fragment": 1,
            "react-compiler/react-compiler": 1
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    //* JavaScript Plugin (Disable Type Checked)
    {
        files: ["**/*.js"],
        extends: [tseslint.configs.disableTypeChecked]
    },
    //* Tailwind Plugin
    {
        files: ["**/*.{js,cjs,mjs,ts,tsx}"],
        plugins: {
            // tailwindcss: tailwind,
            "better-tailwind": betterTailwind
        },
        rules: {
            // "tailwindcss/classnames-order": 1,
            // "tailwindcss/enforces-negative-arbitrary-values": 0,
            // "tailwindcss/enforces-shorthand": 1,
            // "tailwindcss/no-custom-classname": 1,
            // "tailwindcss/no-contradicting-classname": 2,
            // "tailwindcss/no-unnecessary-arbitrary-value": 1,

            //? we just need the `no-unnecessary-whitespace` rule of this package so disable the rest
            //? ("flex   h-fit") => ("flex h-fit")
            //? because the tailwind-eslint-plugin doesn't have that.
            "better-tailwind/multiline": 0,
            "better-tailwind/sort-classes": 0,
            "better-tailwind/no-duplicate-classes": 0,
            "better-tailwind/no-unnecessary-whitespace": [
                1,
                {
                    /** @see https://github.com/schoero/eslint-plugin-readable-tailwind/blob/c71a1bb90a5511fd05239fb839c0e8e0d3538ac9/docs/api/defaults.md */
                    callees: [
                        ...getDefaultCallees(),
                        [
                            "(?:cc|cx|tvg)\\(([^)(]*(?:\\([^)(]*(?:\\([^)(]*(?:\\([^)(]*\\)[^)(]*)*\\)[^)(]*)*\\)[^)(]*)*)\\)",
                            "'([^']*)'"
                        ],
                        [
                            "(?:cc|cx|tvg)\\(([^)(]*(?:\\([^)(]*(?:\\([^)(]*(?:\\([^)(]*\\)[^)(]*)*\\)[^)(]*)*\\)[^)(]*)*)\\)",
                            '"([^"]*)"'
                        ],
                        [
                            "(?:cc|cx|tvg)\\(([^)(]*(?:\\([^)(]*(?:\\([^)(]*(?:\\([^)(]*\\)[^)(]*)*\\)[^)(]*)*\\)[^)(]*)*)\\)",
                            "`([^`]*)`"
                        ]
                    ]
                }
            ]
        },
        settings: {
            tailwindcss: {
                callees: ["clsx", "cva", "cn", "cc", "cx", "tvg", "classnames"],
                config: "tailwind.config.ts",
                cssFiles: [
                    "**/*.css",
                    "!**/node_modules",
                    "!**/.*",
                    "!**/dist",
                    "!**/build"
                ],
                cssFilesRefreshRate: 5_000,
                removeDuplicates: true,
                skipClassAttribute: false,
                whitelist: [],
                tags: ["tw"],
                classRegex: "^(class(Name)?|tw)$"
            }
        }
    },
    //* Legacy Plugins
    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["**/*.mdx"],
        settings: {
            "import/resolver": {
                node: true,
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json"
                }
            }
        },
        plugins: {
            import: importPlugin,
            "simple-import-sort": simpleImportPlugin,
            "import-newlines": importNewlines,
            "@limegrass/import-alias": importAlias
        },
        rules: {
            "import/first": 1,
            "import/newline-after-import": 1,
            "import/no-duplicates": [1, { "prefer-inline": true }],
            "import/no-unresolved": 1,
            "import/extensions": [1, "never"],
            "import/consistent-type-specifier-style": [1, "prefer-inline"],

            "import-newlines/enforce": [
                1,
                { items: 40, "max-len": 80, semi: false }
            ],

            "simple-import-sort/imports": 1,
            "simple-import-sort/exports": 1,

            "@limegrass/import-alias/import-alias": [
                1,
                {
                    isAllowBaseUrlResolvedImport: false,
                    aliasConfigPath: "./tsconfig.json",
                    relativeImportOverrides: [
                        {
                            path: ".",
                            depth: 0
                        }
                    ]
                }
            ]
        }
    }
)
