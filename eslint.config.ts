import stylistic from "@stylistic/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"
import { importX } from "eslint-plugin-import-x"
import oxlint from "eslint-plugin-oxlint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig(
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
            "@typescript-eslint/no-unnecessary-type-conversion": 1
        }
    },
    //* React
    reactHooks.configs.flat["recommended-latest"],
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react,
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
            "react/prop-types": 2
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
            "import-x": importX
        },
        rules: {
            "import-x/no-unresolved": 1
        }
    },
    eslintConfigPrettier,
    stylistic.configs["disable-legacy"],
    ...oxlint.configs["flat/recommended"]
)
