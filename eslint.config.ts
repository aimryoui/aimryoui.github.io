import importAlias from "@limegrass/eslint-plugin-import-alias"
import stylistic from "@stylistic/eslint-plugin"
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import simpleImport from "eslint-plugin-simple-import-sort"
import tailwind from "eslint-plugin-tailwindcss"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig(
    ...nextVitals,
    ...nextTs,
    //* Global Config
    globalIgnores([
        "**/node_modules/",
        "**/.git/",
        ".next/**",
        ".velite/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "pnpm-lock.yaml"
    ]),
    //* TypeScript ESLint
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "@typescript-eslint": tseslint.plugin
        },
        linterOptions: {
            reportUnusedDisableDirectives: true
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            /** Biome hasn't implemented this yet. */
            "@typescript-eslint/no-unnecessary-type-conversion": 1
        }
    },
    //* Next
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            /** Turn off rules that Biome already handles.
             * @see {@link https://biomejs.dev/linter/rules-sources/#nexteslint-plugin-next}
             */
            "@next/next/google-font-display": 0,
            "@next/next/no-document-import-in-page": 0,
            "@next/next/no-head-element": 0,
            "@next/next/no-head-import-in-document": 0,
            "@next/next/no-img-element": 0
        }
    },
    //* React
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    reactHooks.configs.flat["recommended-latest"],
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            //@ts-expect-error - https://github.com/un-ts/eslint-plugin-import-x/issues/421
            "react-hooks": reactHooks
        },
        languageOptions: {
            ...react.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.browser
            }
        },
        rules: {
            "react/no-deprecated": 2,
            // "react/prop-types": 2,
            /** Turn off rules that Biome already handles.
             * @see {@link https://biomejs.dev/linter/rules-sources/#eslint-plugin-react}
             */
            "react/button-has-type": 0,
            "react/jsx-boolean-value": 0,
            "react/jsx-curly-brace-presence": 0,
            "react/jsx-fragments": 0,
            "react/jsx-key": 0,
            "react/jsx-no-comment-textnodes": 0,
            "react/jsx-no-duplicate-props": 0,
            "react/jsx-no-target-blank": 0,
            "react/jsx-no-useless-fragment": 0,
            "react/no-array-index-key": 0,
            "react/no-children-prop": 0,
            "react/no-danger": 0,
            "react/no-danger-with-children": 0,
            "react/void-dom-elements-no-children": 0,
            /** Turn off rules that Biome already handles.
             * @see {@link https://biomejs.dev/linter/rules-sources/#eslint-plugin-react-hooks}
             */
            "react-hooks/exhaustive-deps": 0,
            "react-hooks/rules-of-hooks": 0
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    //* Tailwind CSS
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            tailwindcss: tailwind
        },
        rules: {
            "tailwindcss/classnames-order": 1,
            "tailwindcss/enforces-shorthand": 1,
            "tailwindcss/no-custom-classname": 1,
            "tailwindcss/no-contradicting-classname": 1,
            "tailwindcss/no-unnecessary-arbitrary-value": 1
        },
        settings: {
            tailwindcss: {
                callees: ["cn", "cva", "twg", "twMerge"],
                config: "tailwind.config.ts",
                cssFiles: [
                    "**/*.css",
                    "!**/node_modules",
                    "!**/.next/",
                    "!**/out/",
                    "!**/dist/"
                ],
                cssFilesRefreshRate: 5_000,
                removeDuplicates: false,
                skipClassAttribute: false,
                tags: [],
                classRegex: "^(class(Name)?|containerClassName|tw)$"
            }
        }
    },
    //* Imports
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "simple-import-sort": simpleImport,
            "@limegrass/import-alias": importAlias
        },
        rules: {
            /** Biome hasn't supported sorting named exports WITHOUT `from` yet. */
            "simple-import-sort/exports": 1,

            /** Biome hasn't implemented this yet. */
            "@limegrass/import-alias/import-alias": [
                1,
                {
                    isAllowBaseUrlResolvedImport: false,
                    aliasConfigPath: "./tsconfig.json"
                }
            ]
        }
    },
    eslintConfigPrettier,
    stylistic.configs["disable-legacy"],
    {
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "@stylistic/quotes": [
                1,
                "double",
                { avoidEscape: true, allowTemplateLiterals: "avoidEscape" }
            ]
        }
    }
)
