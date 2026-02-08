import eslint from "@eslint/js"
import importAlias from "@limegrass/eslint-plugin-import-alias"
import stylistic from "@stylistic/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"
import { importX } from "eslint-plugin-import-x"
import react from "eslint-plugin-react"
import reactCompiler from "eslint-plugin-react-compiler"
import reactHooks from "eslint-plugin-react-hooks"
import simpleImport from "eslint-plugin-simple-import-sort"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig(
    //* Global Config
    {
        //! Global ignores always stay alone
        ignores: [
            "**/node_modules/",
            "**/.git/",
            "**/.next/",
            "**/.velite/",
            "**/out/",
            "**/dist/",
            "next-env.d.ts",
            "pnpm-lock.yaml"
        ]
    },
    //* ESLint
    eslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": 0,
            "no-restricted-syntax": [
                "warn",
                {
                    selector:
                        "CallExpression[callee.name='cn'] TemplateLiteral[expressions.length>0]",
                    message:
                        "Do not use template literal interpolation inside cn()."
                }
            ],
            quotes: 0
        }
    },
    //* TypeScript ESLint
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked
        ],
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
            "@typescript-eslint/no-unused-vars": [
                1,
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/require-await": 0,
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/use-unknown-in-catch-callback-variable": 0,
            "@typescript-eslint/unbound-method": 0,
            "@typescript-eslint/no-unused-expressions": 0,
            "@typescript-eslint/consistent-type-definitions": 1,
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
    //* React
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    reactHooks.configs.flat["recommended-latest"],
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react,
            //@ts-expect-error - https://github.com/un-ts/eslint-plugin-import-x/issues/421
            "react-hooks": reactHooks,
            "react-compiler": reactCompiler
        },
        languageOptions: {
            ...react.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.browser
            }
        },
        rules: {
            ...reactCompiler.configs.recommended.rules,
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
    //* Imports
    {
        files: ["**/*.{ts,tsx}"],
        settings: {
            "import-x/resolver-next": [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true,
                    project: "./tsconfig.json"
                })
            ]
        },
        plugins: {
            "import-x": importX,
            "simple-import-sort": simpleImport,
            "@limegrass/import-alias": importAlias
        },
        rules: {
            "import-x/no-duplicates": [1, { "prefer-inline": true }],
            "import-x/no-unresolved": 1,
            "import-x/consistent-type-specifier-style": [1, "prefer-inline"],

            "simple-import-sort/exports": 1,

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
    //* Formatting
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
