import { defineConfig, globalIgnores } from "eslint/config"
import react from "eslint-plugin-react"
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
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        files: ["**/*.{ts,tsx}"],
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
            "@typescript-eslint/no-unnecessary-type-conversion": 1,
            /**
             * Turn off rules that Biome already handles.
             *
             * @see {@link https://biomejs.dev/linter/rules-sources/#typescript-eslint}
             */
            "@typescript-eslint/adjacent-overload-signatures": 0,
            "@typescript-eslint/array-type": 0,
            "@typescript-eslint/no-array-constructor": 0,
            "@typescript-eslint/no-empty-function": 0,
            "@typescript-eslint/no-empty-interface": 0,
            "@typescript-eslint/no-extra-non-null-assertion": 0,
            "@typescript-eslint/no-extraneous-class": 0,
            "@typescript-eslint/no-inferrable-types": 0,
            "@typescript-eslint/no-invalid-void-type": 0,
            "@typescript-eslint/no-misused-new": 0,
            "@typescript-eslint/no-namespace": 0,
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/no-require-imports": 0,
            "@typescript-eslint/no-this-alias": 0,
            "@typescript-eslint/no-unnecessary-type-constraint": 0,
            "@typescript-eslint/no-unsafe-declaration-merging": 0,
            "@typescript-eslint/no-unused-vars": 0,
            "@typescript-eslint/no-useless-constructor": 0,
            "@typescript-eslint/only-throw-error": 0,
            "@typescript-eslint/prefer-as-const": 0,
            "@typescript-eslint/prefer-for-of": 0,
            "@typescript-eslint/prefer-function-type": 0,
            "@typescript-eslint/prefer-literal-enum-member": 0,
            "@typescript-eslint/prefer-namespace-keyword": 0,
            "@typescript-eslint/prefer-optional-chain": 0,
            "@typescript-eslint/require-await": 0,

            "@typescript-eslint/unbound-method": 0
        }
    },
    //* React
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react
        },
        languageOptions: {
            ...react.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.browser
            }
        },
        rules: {
            "react/no-deprecated": 2
            // "react/prop-types": 2
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    }
)
